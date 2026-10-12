import { Inject, Injectable } from '@nestjs/common';
import {
  and,
  count,
  desc,
  eq,
  ilike,
  inArray,
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
  studentEditAccessSelectFields,
  studentIdSelectFields,
} from '../constants/repository';
import { studentLanguageCourses, students } from '../schemas/schema';
import type {
  CreatedStudentResponse,
  CreateManagedStudentData,
  ManagedStudentLookupParams,
  StudentCardResponse,
  StudentDetailsWithEditAccessData,
  StudentEditAccessData,
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
  async getManagedStudentId({
    studentId,
    teacherId,
  }: ManagedStudentLookupParams): Promise<string | undefined> {
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
  async getStudentDetailsWithEditAccess(
    studentId: string,
  ): Promise<StudentDetailsWithEditAccessData | undefined> {
    const [student] = await this.database
      .select(studentDetailsWithEditAccessSelectFields)
      .from(students)
      .innerJoin(users, eq(users.id, students.userId))
      .where(eq(students.userId, studentId))
      .limit(1);

    return student;
  }

  @HandleDatabaseError()
  async getStudentEditAccess(
    studentId: string,
  ): Promise<StudentEditAccessData | undefined> {
    const [student] = await this.database
      .select(studentEditAccessSelectFields)
      .from(students)
      .innerJoin(users, eq(users.id, students.userId))
      .where(eq(students.userId, studentId))
      .limit(1);

    return student;
  }

  /** The student editing their own profile. */
  @HandleDatabaseError()
  async updateStudent(
    studentId: string,
    data: UpdateStudentData,
  ): Promise<UpdatedStudentResponse> {
    return this.database.transaction(async (transaction) => {
      await this.applyStudentUpdate(transaction, studentId, data);

      return { id: studentId };
    });
  }

  /**
   * The creating teacher editing a student who is still managed. The row is
   * locked and re-checked, so a student activating their account at the same
   * moment cannot have their email changed. Returns `undefined` if the student
   * is no longer editable by this teacher.
   */
  @HandleDatabaseError()
  async updateStudentAsCreator(
    { studentId, teacherId }: ManagedStudentLookupParams,
    data: UpdateStudentData,
  ): Promise<UpdatedStudentResponse | undefined> {
    return this.database.transaction(async (transaction) => {
      const [student] = await transaction
        .select(studentIdSelectFields)
        .from(students)
        .innerJoin(users, eq(users.id, students.userId))
        .where(
          and(
            eq(students.userId, studentId),
            eq(students.createdByTeacherId, teacherId),
            eq(users.status, UserStatus.Managed),
          ),
        )
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
