"use server";

import { refresh } from "next/cache";
import { API_ROUTES, type ServerApiResponse } from "@/modules/common/api";
import { serverApiRequest } from "@/modules/common/api/server-api-request";
import { HttpMethod } from "@/modules/common/common.enums";
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

/** Step 1 of an upload: the browser then sends the file straight to storage. */
export const requestCourseDocumentUploadUrlAction = async (
  { courseId, studentId }: GetStudentCourseRequest,
  data: CourseDocumentUploadUrlRequest,
): Promise<ServerApiResponse<CourseDocumentUploadUrlResponse>> =>
  serverApiRequest<CourseDocumentUploadUrlResponse>(
    API_ROUTES.STUDENTS.COURSE_DOCUMENT_UPLOAD_URL(studentId, courseId),
    { body: data, method: HttpMethod.Post },
  );

/** Step 3 of an upload: the document claims the stored file. */
export const createCourseFileDocumentAction = async (
  { courseId, studentId }: GetStudentCourseRequest,
  data: CreateCourseFileDocumentRequest,
): Promise<ServerApiResponse<CreateCourseDocumentResponse>> => {
  const response = await serverApiRequest<CreateCourseDocumentResponse>(
    API_ROUTES.STUDENTS.COURSE_DOCUMENT_FILES(studentId, courseId),
    { body: data, method: HttpMethod.Post },
  );

  if (response.ok) {
    refresh();
  }

  return response;
};

export const createCourseLinkDocumentAction = async (
  { courseId, studentId }: GetStudentCourseRequest,
  data: CreateCourseLinkDocumentRequest,
): Promise<ServerApiResponse<CreateCourseDocumentResponse>> => {
  const response = await serverApiRequest<CreateCourseDocumentResponse>(
    API_ROUTES.STUDENTS.COURSE_DOCUMENT_LINKS(studentId, courseId),
    { body: data, method: HttpMethod.Post },
  );

  if (response.ok) {
    refresh();
  }

  return response;
};

export const deleteCourseDocumentAction = async ({
  courseId,
  documentId,
  studentId,
}: GetCourseDocumentRequest): Promise<ServerApiResponse<void>> => {
  const response = await serverApiRequest<void>(
    API_ROUTES.STUDENTS.COURSE_DOCUMENT_BY_ID(studentId, courseId, documentId),
    { method: HttpMethod.Delete },
  );

  if (response.ok) {
    refresh();
  }

  return response;
};

/** A short-lived storage URL; the browser opens it in a new tab. */
export const getCourseDocumentDownloadUrlAction = async ({
  courseId,
  documentId,
  studentId,
}: GetCourseDocumentRequest): Promise<
  ServerApiResponse<CourseDocumentDownloadUrlResponse>
> =>
  serverApiRequest<CourseDocumentDownloadUrlResponse>(
    API_ROUTES.STUDENTS.COURSE_DOCUMENT_DOWNLOAD_URL(
      studentId,
      courseId,
      documentId,
    ),
  );
