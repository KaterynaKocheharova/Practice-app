import { API_ROUTES, apiJsonRequest, apiRequest } from "@/modules/common/api";
import type {
  CourseDocumentDownloadUrlResponse,
  CourseDocumentUploadUrlRequest,
  CourseDocumentUploadUrlResponse,
  CreateCourseDocumentResponse,
  CreateCourseFileDocumentRequest,
  CreateCourseLinkDocumentRequest,
  GetCourseDocumentRequest,
  GetStudentCourseRequest,
} from "../types";

export function requestCourseDocumentUploadUrl(
  { courseId, studentId }: GetStudentCourseRequest,
  data: CourseDocumentUploadUrlRequest,
): Promise<CourseDocumentUploadUrlResponse> {
  return apiJsonRequest<
    CourseDocumentUploadUrlResponse,
    CourseDocumentUploadUrlRequest
  >(API_ROUTES.STUDENTS.COURSE_DOCUMENT_UPLOAD_URL(studentId, courseId), data, {
    method: "POST",
  });
}

export function createCourseFileDocument(
  { courseId, studentId }: GetStudentCourseRequest,
  data: CreateCourseFileDocumentRequest,
): Promise<CreateCourseDocumentResponse> {
  return apiJsonRequest<
    CreateCourseDocumentResponse,
    CreateCourseFileDocumentRequest
  >(API_ROUTES.STUDENTS.COURSE_DOCUMENT_FILES(studentId, courseId), data, {
    method: "POST",
  });
}

export function createCourseLinkDocument(
  { courseId, studentId }: GetStudentCourseRequest,
  data: CreateCourseLinkDocumentRequest,
): Promise<CreateCourseDocumentResponse> {
  return apiJsonRequest<
    CreateCourseDocumentResponse,
    CreateCourseLinkDocumentRequest
  >(API_ROUTES.STUDENTS.COURSE_DOCUMENT_LINKS(studentId, courseId), data, {
    method: "POST",
  });
}

export function getCourseDocumentDownloadUrl({
  courseId,
  documentId,
  studentId,
}: GetCourseDocumentRequest): Promise<CourseDocumentDownloadUrlResponse> {
  return apiRequest<CourseDocumentDownloadUrlResponse>(
    API_ROUTES.STUDENTS.COURSE_DOCUMENT_DOWNLOAD_URL(
      studentId,
      courseId,
      documentId,
    ),
  );
}

export function deleteCourseDocument({
  courseId,
  documentId,
  studentId,
}: GetCourseDocumentRequest): Promise<void> {
  return apiRequest<void>(
    API_ROUTES.STUDENTS.COURSE_DOCUMENT_BY_ID(studentId, courseId, documentId),
    { method: "DELETE" },
  );
}
