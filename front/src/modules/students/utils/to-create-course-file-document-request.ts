import type { CreateCourseFileDocumentRequest } from "../types";

/** An empty title is left out so the backend uses the file name. */
export const toCreateCourseFileDocumentRequest = (
  mediaAssetId: string,
  title: string,
): CreateCourseFileDocumentRequest =>
  title ? { mediaAssetId, title } : { mediaAssetId };
