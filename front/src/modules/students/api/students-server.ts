import "server-only";

import {
  API_ROUTES,
  type ServerApiResponse,
} from "@/modules/common/api";
import { serverApiRequest } from "@/modules/common/api/server-api-request";
import { type Language, StudentsQueryParam } from "../students.enums";
import type {
  GetStudentCourseRequest,
  GetStudentCoursesRequest,
  GetStudentsRequest,
  StudentCourseCard,
  StudentCourseDetails,
  StudentDetails,
  StudentsPage,
} from "../types";

export const getStudentsPageServer = ({
  limit,
  offset,
}: GetStudentsRequest): Promise<ServerApiResponse<StudentsPage>> => {
  const searchParams = new URLSearchParams({
    [StudentsQueryParam.Limit]: String(limit),
    [StudentsQueryParam.Offset]: String(offset),
  });

  return serverApiRequest<StudentsPage>(
    `${API_ROUTES.STUDENTS.ROOT}?${searchParams.toString()}`,
  );
};

export const getStudentServer = (
  studentId: string,
): Promise<ServerApiResponse<StudentDetails>> =>
  serverApiRequest<StudentDetails>(API_ROUTES.STUDENTS.BY_ID(studentId));

export const getStudentCoursesServer = ({
  language,
  studentId,
}: GetStudentCoursesRequest): Promise<ServerApiResponse<StudentCourseCard[]>> => {
  const path = API_ROUTES.STUDENTS.COURSES(studentId);

  if (!language) {
    return serverApiRequest<StudentCourseCard[]>(path);
  }

  const searchParams = new URLSearchParams({
    [StudentsQueryParam.Language]: language,
  });

  return serverApiRequest<StudentCourseCard[]>(
    `${path}?${searchParams.toString()}`,
  );
};

export const getStudentCourseServer = ({
  courseId,
  studentId,
}: GetStudentCourseRequest): Promise<ServerApiResponse<StudentCourseDetails>> =>
  serverApiRequest<StudentCourseDetails>(
    API_ROUTES.STUDENTS.COURSE_BY_ID(studentId, courseId),
  );

/** Languages the teacher can still open a course in with the student. */
export const getAvailableCourseLanguagesServer = (
  studentId: string,
): Promise<ServerApiResponse<Language[]>> =>
  serverApiRequest<Language[]>(
    API_ROUTES.STUDENTS.AVAILABLE_COURSE_LANGUAGES(studentId),
  );
