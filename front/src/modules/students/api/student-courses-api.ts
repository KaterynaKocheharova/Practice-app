import { API_ROUTES, apiJsonRequest, apiRequest } from "@/modules/common/api";
import { type Language, StudentsQueryParam } from "../students.enums";
import type {
  CreateStudentCourseRequest,
  CreateStudentCourseResponse,
  GetStudentCourseRequest,
  GetStudentCoursesRequest,
  StudentCourseCard,
  StudentCourseDetails,
  UpdateStudentCourseRequest,
  UpdateStudentCourseResponse,
} from "../types";

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

export function updateStudentCourse(
  { courseId, studentId }: GetStudentCourseRequest,
  data: UpdateStudentCourseRequest,
): Promise<UpdateStudentCourseResponse> {
  return apiJsonRequest<
    UpdateStudentCourseResponse,
    UpdateStudentCourseRequest
  >(API_ROUTES.STUDENTS.COURSE_BY_ID(studentId, courseId), data, {
    method: "PATCH",
  });
}
