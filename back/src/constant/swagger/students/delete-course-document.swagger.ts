import { COURSE_DOCUMENTS_SWAGGER } from './course-documents.swagger';

const { ACCESS_DESCRIPTION, COURSE_NOT_FOUND_DESCRIPTION } =
  COURSE_DOCUMENTS_SWAGGER;

export const DELETE_COURSE_DOCUMENT_SWAGGER = {
  SUMMARY: 'Delete a course document',
  DESCRIPTION: `Deletes a document added by the caller. It disappears from the course immediately; a background job then removes the stored file and the record for good. ${ACCESS_DESCRIPTION} Only the user who added a document can delete it.`,
  NO_CONTENT_RESPONSE_DESCRIPTION: 'Document deleted.',
  BAD_REQUEST_RESPONSE_DESCRIPTION: 'Returned when an id is not a valid UUID.',
  NOT_FOUND_RESPONSE_DESCRIPTION: `Returned when ${COURSE_NOT_FOUND_DESCRIPTION}, or the document does not exist in this course, was already deleted, or was added by another user (COURSE_DOCUMENT_NOT_FOUND).`,
} as const;
