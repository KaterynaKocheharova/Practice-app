import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DatabaseConfig } from '../../../database/config/config';
import { HandleDatabaseError } from '../../../database/decorators';
import {
  studentLanguageCourseCardSelectFields,
  studentLanguageCourseDetailsSelectFields,
  studentLanguageCourseIdSelectFields,
  studentLanguageCourseStudentViewSelectFields,
} from '../constants/repository';
import { studentLanguageCourses } from '../schemas/schema';
import type {
  CreateStudentLanguageCourseData,
  CreatedStudentLanguageCourseResponse,
  StudentLanguageCourseCardResponse,
  StudentLanguageCourseDetailsResponse,
  ManagedStudentLookupParams,
  StudentLanguageCourseKey,
  StudentLanguageCourseLookupParams,
  StudentLanguageCourseStudentViewResponse,
  TeacherStudentLanguageCourseLookupParams,
} from '../types';

@Injectable()
export class StudentLanguageCoursesRepository {
  constructor(
    @Inject(DatabaseConfig.DATABASE_INJECTION_TOKEN)
    private readonly database: NodePgDatabase,
  ) {}

  @HandleDatabaseError()
  async createStudentLanguageCourse(
    course: CreateStudentLanguageCourseData,
  ): Promise<CreatedStudentLanguageCourseResponse> {
    const [createdCourse] = await this.database
      .insert(studentLanguageCourses)
      .values(course)
      .returning(studentLanguageCourseIdSelectFields);

    return createdCourse;
  }

  @HandleDatabaseError()
  async getStudentLanguageCourseId({
    studentId,
    teacherId,
    language,
  }: StudentLanguageCourseKey): Promise<string | undefined> {
    const [course] = await this.database
      .select(studentLanguageCourseIdSelectFields)
      .from(studentLanguageCourses)
      .where(
        and(
          eq(studentLanguageCourses.studentId, studentId),
          eq(studentLanguageCourses.teacherId, teacherId),
          eq(studentLanguageCourses.language, language),
        ),
      )
      .limit(1);

    return course?.id;
  }

  /** All courses of a student, from every teacher (the student's own view). */
  @HandleDatabaseError()
  async getStudentLanguageCourseCards(
    studentId: string,
  ): Promise<StudentLanguageCourseCardResponse[]> {
    return this.database
      .select(studentLanguageCourseCardSelectFields)
      .from(studentLanguageCourses)
      .where(eq(studentLanguageCourses.studentId, studentId))
      .orderBy(desc(studentLanguageCourses.createdAt));
  }

  /** Only the courses the given teacher runs with the student. */
  @HandleDatabaseError()
  async getTeacherStudentLanguageCourseCards({
    studentId,
    teacherId,
  }: ManagedStudentLookupParams): Promise<StudentLanguageCourseCardResponse[]> {
    return this.database
      .select(studentLanguageCourseCardSelectFields)
      .from(studentLanguageCourses)
      .where(
        and(
          eq(studentLanguageCourses.studentId, studentId),
          eq(studentLanguageCourses.teacherId, teacherId),
        ),
      )
      .orderBy(desc(studentLanguageCourses.createdAt));
  }

  /** A course as seen by the student: without the teacher's comments. */
  @HandleDatabaseError()
  async getStudentLanguageCourseStudentView({
    courseId,
    studentId,
  }: StudentLanguageCourseLookupParams): Promise<
    StudentLanguageCourseStudentViewResponse | undefined
  > {
    const [course] = await this.database
      .select(studentLanguageCourseStudentViewSelectFields)
      .from(studentLanguageCourses)
      .where(
        and(
          eq(studentLanguageCourses.id, courseId),
          eq(studentLanguageCourses.studentId, studentId),
        ),
      )
      .limit(1);

    return course;
  }

  /** A course as seen by its teacher: all fields, only if they run it. */
  @HandleDatabaseError()
  async getStudentLanguageCourseDetails({
    courseId,
    studentId,
    teacherId,
  }: TeacherStudentLanguageCourseLookupParams): Promise<
    StudentLanguageCourseDetailsResponse | undefined
  > {
    const [course] = await this.database
      .select(studentLanguageCourseDetailsSelectFields)
      .from(studentLanguageCourses)
      .where(
        and(
          eq(studentLanguageCourses.id, courseId),
          eq(studentLanguageCourses.studentId, studentId),
          eq(studentLanguageCourses.teacherId, teacherId),
        ),
      )
      .limit(1);

    return course;
  }
}
