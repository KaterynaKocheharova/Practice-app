"use client";

import {
  type ServerApiResponse,
  uploadToPresignedUrl,
} from "@/modules/common/api";
import { useServerAction } from "@/modules/common/hooks";
import {
  createCourseFileDocumentAction,
  requestCourseDocumentUploadUrlAction,
} from "../actions/course-documents-actions";
import type {
  CreateCourseDocumentResponse,
  GetStudentCourseRequest,
  UploadCourseDocumentInput,
} from "../types";
import {
  toCourseDocumentUploadUrlRequest,
  toCreateCourseFileDocumentRequest,
} from "../utils";

const STORAGE_UPLOAD_FAILED: ServerApiResponse<never> = {
  errorCode: null,
  ok: false,
  status: null,
};

/**
 * Upload URL from the backend, the file straight from the browser to storage,
 * then the document that claims it (its action refreshes the course page).
 */
const uploadCourseDocument = async (
  course: GetStudentCourseRequest,
  { file, title }: UploadCourseDocumentInput,
): Promise<ServerApiResponse<CreateCourseDocumentResponse>> => {
  const uploadUrl = await requestCourseDocumentUploadUrlAction(
    course,
    toCourseDocumentUploadUrlRequest(file),
  );

  if (!uploadUrl.ok) {
    return uploadUrl;
  }

  if (!(await uploadToPresignedUrl(uploadUrl.data.uploadUrl, file))) {
    return STORAGE_UPLOAD_FAILED;
  }

  return createCourseFileDocumentAction(
    course,
    toCreateCourseFileDocumentRequest(uploadUrl.data.mediaAssetId, title),
  );
};

export const useUploadCourseDocument = (course: GetStudentCourseRequest) =>
  useServerAction((input: UploadCourseDocumentInput) =>
    uploadCourseDocument(course, input),
  );
