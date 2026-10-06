import { API_ROUTES, apiJsonRequest, apiRequest } from "@/modules/common/api";
import { type Language, StudentsQueryParam } from "../students.enums";
import type {
  CreateStudentCourseRequest,
  CreateStudentCourseResponse,
  CreateStudentRequest,
  CreateStudentResponse,
  GetStudentCourseRequest,
  GetStudentCoursesRequest,
  GetStudentsRequest,
  StudentCourseCard,
  StudentCourseDetails,
  StudentDetails,
  StudentsPage,
} from "../types";

export function getStudents({
  limit,
  offset,
}: GetStudentsRequest): Promise<StudentsPage> {
  const searchParams = new URLSearchParams({
    [StudentsQueryParam.Limit]: String(limit),
    [StudentsQueryParam.Offset]: String(offset),
  });

  return apiRequest<StudentsPage>(
    `${API_ROUTES.STUDENTS.ROOT}?${searchParams.toString()}`,
  );
}

export function createStudent(
  data: CreateStudentRequest,
): Promise<CreateStudentResponse> {
  return apiJsonRequest<CreateStudentResponse, CreateStudentRequest>(
    API_ROUTES.STUDENTS.ROOT,
    data,
    {
      method: "POST",
    },
  );
}

export function getStudent(studentId: string): Promise<StudentDetails> {
  return apiRequest<StudentDetails>(API_ROUTES.STUDENTS.BY_ID(studentId));
}

export function getStudentCourses({
  language,
  studentId,
}: GetStudentCoursesRequest): Promise<StudentCourseCard[]> {
  const path = API_ROUTES.STUDENTS.COURSES(studentId);

  if (!language) {
    return apiRequest<StudentCourseCard[]>(path);
  }

  const searchParams = new URLSearchParams({
    [StudentsQueryParam.Language]: language,
  });

  return apiRequest<StudentCourseCard[]>(`${path}?${searchParams.toString()}`);
}

export function getStudentCourse({
  courseId,
  studentId,
}: GetStudentCourseRequest): Promise<StudentCourseDetails> {
  return apiRequest<StudentCourseDetails>(
    API_ROUTES.STUDENTS.COURSE_BY_ID(studentId, courseId),
  );
}

export function createStudentCourse(
  studentId: string,
  data: CreateStudentCourseRequest,
): Promise<CreateStudentCourseResponse> {
  return apiJsonRequest<
    CreateStudentCourseResponse,
    CreateStudentCourseRequest
  >(API_ROUTES.STUDENTS.COURSES(studentId), data, {
    method: "POST",
  });
}

export function getAvailableCourseLanguages(
  studentId: string,
): Promise<Language[]> {
  return apiRequest<Language[]>(
    API_ROUTES.STUDENTS.AVAILABLE_COURSE_LANGUAGES(studentId),
  );
}
