import { STUDENTS_CONFIG } from "../students.config";
import type { MediaAssetKind } from "../students.enums";

export const getCourseDocumentKind = (file: File): MediaAssetKind | null =>
  STUDENTS_CONFIG.documents.allowedMimeTypes[file.type] ?? null;
