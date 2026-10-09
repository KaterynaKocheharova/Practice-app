import type { CourseDocumentUploadUrlRequest } from "../types";

export const toCourseDocumentUploadUrlRequest = (
  file: File,
): CourseDocumentUploadUrlRequest => ({
  fileName: file.name,
  mimeType: file.type,
  sizeBytes: file.size,
});
