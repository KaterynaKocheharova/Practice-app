import { ERRORS } from "@/modules/common/constants";
import { StudentsErrorCode } from "../students.enums";

const COURSE_DOCUMENT_ERROR_MESSAGES: Partial<Record<string, string>> = {
  [StudentsErrorCode.CourseDocumentsLimitReached]:
    ERRORS.COURSE_DOCUMENTS.LIMIT_REACHED,
};

export const getCourseDocumentErrorMessage = (
  errorCode: string | null,
  fallbackMessage: string,
): string => COURSE_DOCUMENT_ERROR_MESSAGES[errorCode ?? ""] ?? fallbackMessage;
