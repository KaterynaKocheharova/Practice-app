import { Inject, Injectable } from '@nestjs/common';
import {
  and,
  count,
  desc,
  eq,
  ilike,
  inArray,
  ne,
  or,
  type SQL,
} from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { escapeLikePattern, hasDefinedValues } from '../../../common/helpers';
import { DatabaseConfig } from '../../../database/config/config';
import { HandleDatabaseError } from '../../../database/decorators';
import { UserStatus } from '../../users/enums';
import { users } from '../../users/schemas/schema';
import type { DatabaseTransaction } from '../../users/types';
import {
  studentCardSelectFields,
  studentDetailsWithEditAccessSelectFields,
  studentIdSelectFields,
} from '../constants/repository';
import { studentLanguageCourses, students } from '../schemas/schema';
import type {
  CreatedStudentResponse,
  CreateManagedStudentData,
  StudentAccessParams,
  StudentCardResponse,
  StudentDetailsWithEditAccessData,
  TeacherStudentLookupParams,
  TeacherStudentsFilterParams,
  TeacherStudentsPageParams,
  UpdatedStudentResponse,
  UpdateStudentData,
} from '../types';

@Injectable()
export class StudentsRepository {
  constructor(
    @Inject(DatabaseConfig.DATABASE_INJECTION_TOKEN)
    private readonly database: NodePgDatabase,
  ) {}

  @HandleDatabaseError()
  async createManagedStudent(
    data: CreateManagedStudentData,
  ): Promise<CreatedStudentResponse> {
    return this.database.transaction(async (transaction) => {
      const [user] = await transaction
        .insert(users)
        .values(data.user)
        .returning({ id: users.id });

      await transaction
        .insert(students)
        .values({ ...data.student, userId: user.id });

      return { id: user.id };
    });
  }

  @HandleDatabaseError()
  async getTeacherStudentId({
    studentId,
    teacherId,
  }: TeacherStudentLookupParams): Promise<string | undefined> {
    const [student] = await this.database
      .select({ userId: students.userId })
      .from(students)
      .where(
        and(eq(students.userId, studentId), this.belongsToTeacher(teacherId)),
      )
      .limit(1);

    return student?.userId;
  }

  @HandleDatabaseError()
  async getTeacherStudentCards({
    limit,
    offset,
    ...filter
  }: TeacherStudentsPageParams): Promise<StudentCardResponse[]> {
    return this.database
      .select(studentCardSelectFields)
      .from(students)
      .innerJoin(users, eq(users.id, students.userId))
      .where(this.teacherStudentsFilter(filter))
      .orderBy(desc(students.createdAt), desc(students.userId))
      .limit(limit)
      .offset(offset);
  }

  @HandleDatabaseError()
  async countTeacherStudents(
    filter: TeacherStudentsFilterParams,
  ): Promise<number> {
    const [result] = await this.database
      .select({ total: count() })
      .from(students)
      .innerJoin(users, eq(users.id, students.userId))
      .where(this.teacherStudentsFilter(filter));

    return result.total;
  }

  @HandleDatabaseError()
  async getStudentDetailsWithEditAccess({
    viewer,
    studentId,
  }: StudentAccessParams): Promise<
    StudentDetailsWithEditAccessData | undefined
  > {
    const [student] = await this.database
      .select(studentDetailsWithEditAccessSelectFields)
      .from(students)
      .innerJoin(users, eq(users.id, students.userId))
      .where(
        and(
          eq(students.userId, studentId),
          or(eq(students.userId, viewer.id), this.belongsToTeacher(viewer.id)),
        ),
      )
      .limit(1);

    return student;
  }

  @HandleDatabaseError()
  async updateOwnStudent(
    studentId: string,
    data: UpdateStudentData,
  ): Promise<UpdatedStudentResponse | undefined> {
    return this.updateLockedStudent(
      and(eq(students.userId, studentId), ne(users.status, UserStatus.Managed)),
      studentId,
      data,
    );
  }

  @HandleDatabaseError()
  async updateStudentAsCreator(
    { studentId, teacherId }: TeacherStudentLookupParams,
    data: UpdateStudentData,
  ): Promise<UpdatedStudentResponse | undefined> {
    return this.updateLockedStudent(
      and(
        eq(students.userId, studentId),
        eq(students.createdByTeacherId, teacherId),
        eq(users.status, UserStatus.Managed),
      ),
      studentId,
      data,
    );
  }

  // The row lock keeps the managed status from flipping between the check and
  // the write, e.g. a teacher changing the email while the student activates.
  private async updateLockedStudent(
    editableFilter: SQL | undefined,
    studentId: string,
    data: UpdateStudentData,
  ): Promise<UpdatedStudentResponse | undefined> {
    return this.database.transaction(async (transaction) => {
      const [student] = await transaction
        .select(studentIdSelectFields)
        .from(students)
        .innerJoin(users, eq(users.id, students.userId))
        .where(editableFilter)
        .limit(1)
        .for('update');

      if (!student) {
        return undefined;
      }

      await this.applyStudentUpdate(transaction, studentId, data);

      return student;
    });
  }

  private async applyStudentUpdate(
    transaction: DatabaseTransaction,
    studentId: string,
    { user, student }: UpdateStudentData,
  ): Promise<void> {
    if (hasDefinedValues(user)) {
      await transaction.update(users).set(user).where(eq(users.id, studentId));
    }

    if (hasDefinedValues(student)) {
      await transaction
        .update(students)
        .set(student)
        .where(eq(students.userId, studentId));
    }
  }

  private teacherStudentsFilter({
    teacherId,
    search,
  }: TeacherStudentsFilterParams): SQL | undefined {
    return and(
      this.belongsToTeacher(teacherId),
      search ? this.startsWithFilter(search) : undefined,
    );
  }

  private startsWithFilter(search: string): SQL | undefined {
    const pattern = `${escapeLikePattern(search)}%`;

    return or(ilike(users.name, pattern), ilike(users.email, pattern));
  }

  /**
   * A student belongs to a teacher who created them or who teaches them a course.
   */
  private belongsToTeacher(teacherId: string): SQL | undefined {
    return or(
      eq(students.createdByTeacherId, teacherId),
      inArray(students.userId, this.teacherCourseStudentIds(teacherId)),
    );
  }

  /** Subquery: ids of students who have a course with the teacher. */
  private teacherCourseStudentIds(teacherId: string) {
    return this.database
      .select({ id: studentLanguageCourses.studentId })
      .from(studentLanguageCourses)
      .where(eq(studentLanguageCourses.teacherId, teacherId));
  }
}
