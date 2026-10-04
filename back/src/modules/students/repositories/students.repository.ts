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

import { DatabaseConfig } from '../../../database/config/config';
import { HandleDatabaseError } from '../../../database/decorators';
import { users } from '../../users/schemas/schema';
import {
  studentCardSelectFields,
  studentDetailsSelectFields,
} from '../constants/repository';
import type { Language } from '../enums';
import { studentLanguageCourses, students } from '../schemas/schema';
import type {
  CreatedStudentResponse,
  CreateManagedStudentData,
  ManagedStudentLookupParams,
  StudentCardResponse,
  StudentDetailsResponse,
  TeacherStudentsFilterParams,
  TeacherStudentsPageParams,
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
  async getStudentDetailsById(
    studentId: string,
  ): Promise<StudentDetailsResponse | undefined> {
    const [student] = await this.database
      .select(studentDetailsSelectFields)
      .from(students)
      .innerJoin(users, eq(users.id, students.userId))
      .where(eq(students.userId, studentId))
      .limit(1);

    return student;
  }

  private teacherStudentsFilter({
    teacherId,
    search,
    languages,
  }: TeacherStudentsFilterParams): SQL | undefined {
    return and(
      this.belongsToTeacher(teacherId),
      search ? this.matchesSearch(teacherId, search, languages) : undefined,
    );
  }

  /** Name starts with the search text, or a course with this teacher is in a matching language. */
  private matchesSearch(
    teacherId: string,
    search: string,
    languages: Language[],
  ): SQL | undefined {
    return or(
      ilike(users.name, `${search}%`),
      languages.length
        ? inArray(
            students.userId,
            this.teacherCourseStudentIds(teacherId, languages),
          )
        : undefined,
    );
  }

  /**
   * A student belongs to a teacher who created them or who teaches them a course.
   */
  private belongsToTeacher(teacherId: string): SQL | undefined {
    return or(
      eq(students.createdByTeacherId, teacherId),
      inArray(students.userId, this.teacherCourseStudentIds(teacherId, null)),
    );
  }

  /**
   * Subquery: ids of students who have a course with the teacher,
   * optionally only in the given languages.
   */
  private teacherCourseStudentIds(
    teacherId: string,
    languages: Language[] | null,
  ) {
    return this.database
      .select({ id: studentLanguageCourses.studentId })
      .from(studentLanguageCourses)
      .where(
        and(
          eq(studentLanguageCourses.teacherId, teacherId),
          languages
            ? inArray(studentLanguageCourses.language, languages)
            : undefined,
        ),
      );
  }
}
