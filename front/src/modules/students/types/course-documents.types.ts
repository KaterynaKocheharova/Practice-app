import type { UserRole } from "@/modules/auth/auth.enums";
import type { CourseDocumentType, MediaAssetKind } from "../students.enums";
import type { GetStudentCourseRequest } from "./students.types";

export interface CourseDocumentFile {
  sizeBytes: number;
  kind: MediaAssetKind;
}

export interface CourseDocumentAuthor {
  name: string;
  role: UserRole;
}

interface CourseDocumentBase {
  id: string;
  title: string;
  addedBy: CourseDocumentAuthor | null;
  canDelete: boolean;
}

export type CourseFileDocument = CourseDocumentBase & {
  type: CourseDocumentType.File;
  url: null;
  file: CourseDocumentFile;
};

export type CourseLinkDocument = CourseDocumentBase & {
  type: CourseDocumentType.Link;
  url: string;
  file: null;
};

export type CourseDocument = CourseFileDocument | CourseLinkDocument;

export interface GetCourseDocumentRequest extends GetStudentCourseRequest {
  documentId: string;
}

export interface CourseDocumentUploadUrlRequest {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}

export interface CourseDocumentUploadUrlResponse {
  mediaAssetId: string;
  uploadUrl: string;
}

export type CreateCourseFileDocumentRequest = Pick<
  CourseDocumentUploadUrlResponse,
  "mediaAssetId"
> &
  Partial<Pick<CourseDocument, "title">>;

export type CreateCourseLinkDocumentRequest = Pick<CourseDocument, "title"> & {
  url: string;
};

export interface CreateCourseDocumentResponse {
  id: string;
}

export interface CourseDocumentDownloadUrlResponse {
  url: string;
}

/** What the upload form hands to the upload flow. */
export interface UploadCourseDocumentInput {
  file: File;
  title: string;
}
