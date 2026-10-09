import { COURSE_DOCUMENTS_SWAGGER } from './course-documents.swagger';

const { ACCESS_DESCRIPTION, COURSE_NOT_FOUND_DESCRIPTION } =
  COURSE_DOCUMENTS_SWAGGER;

export const CREATE_COURSE_LINK_DOCUMENT_SWAGGER = {
  SUMMARY: 'Add a link to a course',
  DESCRIPTION: `Adds an external https link (for example a Google Sheet) to the course. The link is stored as-is and never fetched by the server. ${ACCESS_DESCRIPTION}`,
  REQUEST_BODY_DESCRIPTION: 'An https URL and a title, both required.',
  CREATED_RESPONSE_DESCRIPTION: 'Link document created. Returns its id.',
  BODY: {
    URL: {
      EXAMPLE: 'https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOp/edit',
      DESCRIPTION: 'External link; https only.',
    },
    TITLE: {
      EXAMPLE: 'Vocabulary sheet',
      DESCRIPTION: 'Title shown in the course documents list.',
    },
  },
  BAD_REQUEST_RESPONSE_DESCRIPTION:
    'Returned when an id is not a valid UUID, the URL is not a valid https URL, or the title is missing or too long.',
  NOT_FOUND_RESPONSE_DESCRIPTION: `Returned when ${COURSE_NOT_FOUND_DESCRIPTION}.`,
} as const;
