import { COURSE_DOCUMENTS_SWAGGER } from './course-documents.swagger';

const { ACCESS_DESCRIPTION, COURSE_NOT_FOUND_DESCRIPTION } =
  COURSE_DOCUMENTS_SWAGGER;

export const GET_COURSE_DOCUMENT_DOWNLOAD_URL_SWAGGER = {
  SUMMARY: 'Get a URL to open a course document',
  DESCRIPTION: `Returns a presigned URL valid for 5 minutes that opens the file: the browser displays PDFs, images, audio and text inline and downloads other types, keeping the original file name. Only file documents have one; links are opened directly. ${ACCESS_DESCRIPTION}`,
  OK_RESPONSE_DESCRIPTION: 'Presigned URL to open the file.',
  OK_RESPONSE_EXAMPLE: {
    url: 'https://storage.example.com/app-documents/uploads/0f1e2d3c-4b5a-6978-8a9b-0c1d2e3f4a5b/1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d?response-content-disposition=inline%3B%20filename%2A%3DUTF-8%27%27homework.pdf&X-Amz-Expires=300&X-Amz-Signature=...',
  },
  BAD_REQUEST_RESPONSE_DESCRIPTION: 'Returned when an id is not a valid UUID.',
  NOT_FOUND_RESPONSE_DESCRIPTION: `Returned when ${COURSE_NOT_FOUND_DESCRIPTION}, or the document does not exist in this course, was deleted, or is a link (COURSE_DOCUMENT_NOT_FOUND).`,
} as const;
