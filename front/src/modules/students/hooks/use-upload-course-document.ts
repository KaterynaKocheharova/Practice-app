"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadToPresignedUrl } from "@/modules/common/api";
import {
  createCourseFileDocument,
  requestCourseDocumentUploadUrl,
} from "../api";
import { STUDENTS_CONFIG } from "../students.config";
import type {
  GetStudentCourseRequest,
  UploadCourseDocumentInput,
} from "../types";
import {
  toCourseDocumentUploadUrlRequest,
  toCreateCourseFileDocumentRequest,
} from "../utils";

/**
 * Upload URL from the backend, the file straight to storage, then the
 * document that claims it. Refreshes the course, whose details list documents.
 */
export const useUploadCourseDocument = (course: GetStudentCourseRequest) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, title }: UploadCourseDocumentInput) => {
      const { mediaAssetId, uploadUrl } = await requestCourseDocumentUploadUrl(
        course,
        toCourseDocumentUploadUrlRequest(file),
      );
      await uploadToPresignedUrl(uploadUrl, file);

      return createCourseFileDocument(
        course,
        toCreateCourseFileDocumentRequest(mediaAssetId, title),
      );
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: STUDENTS_CONFIG.queryKeys.course(
          course.studentId,
          course.courseId,
        ),
      }),
  });
};
