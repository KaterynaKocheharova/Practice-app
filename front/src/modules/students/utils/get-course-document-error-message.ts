import { getApiErrorCode } from "@/modules/common/api";
import { ERRORS } from "@/modules/common/constants";
import { StudentsErrorCode } from "../students.enums";

const COURSE_DOCUMENT_ERROR_MESSAGES: Partial<Record<string, string>> = {
  [StudentsErrorCode.CourseDocumentsLimitReached]:
    ERRORS.COURSE_DOCUMENTS.LIMIT_REACHED,
};

export const getCourseDocumentErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string =>
  COURSE_DOCUMENT_ERROR_MESSAGES[getApiErrorCode(error) ?? ""] ??
  fallbackMessage;
