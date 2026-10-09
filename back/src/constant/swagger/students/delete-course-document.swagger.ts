import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import {
  COURSE_DOCUMENTS_PATH,
  COURSE_DOCUMENTS_SWAGGER,
} from './course-documents.swagger';

const { ACCESS_DESCRIPTION, COURSE_NOT_FOUND_DESCRIPTION } =
  COURSE_DOCUMENTS_SWAGGER;

export const DELETE_COURSE_DOCUMENT_SWAGGER = {
  SUMMARY: 'Delete a course document',
  DESCRIPTION: `Deletes a document added by the caller. It disappears from the course immediately; a background job then removes the stored file and the record for good. ${ACCESS_DESCRIPTION} Only the user who added a document can delete it.`,
  NO_CONTENT_RESPONSE_DESCRIPTION: 'Document deleted.',
  BAD_REQUEST_RESPONSE_DESCRIPTION: 'Returned when an id is not a valid UUID.',
  FORBIDDEN_RESPONSE_DESCRIPTION:
    'Returned when the document was added by another user.',
  FORBIDDEN_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 403,
    errorCode: ERROR_CODE.COURSE_DOCUMENT_DELETE_FORBIDDEN,
    message: 'You can only delete documents you added.',
    path: `${COURSE_DOCUMENTS_PATH}/{documentId}`,
    timestamp: '2026-09-01T00:00:00.000Z',
  },
  NOT_FOUND_RESPONSE_DESCRIPTION: `Returned when ${COURSE_NOT_FOUND_DESCRIPTION}, or the document does not exist in this course or was already deleted (COURSE_DOCUMENT_NOT_FOUND).`,
} as const;
