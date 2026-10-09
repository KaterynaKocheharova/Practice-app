import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import {
  COURSE_DOCUMENTS_PATH,
  COURSE_DOCUMENTS_SWAGGER,
} from './course-documents.swagger';

const { ACCESS_DESCRIPTION, COURSE_NOT_FOUND_DESCRIPTION } =
  COURSE_DOCUMENTS_SWAGGER;
const FILES_PATH = `${COURSE_DOCUMENTS_PATH}/files`;

export const CREATE_COURSE_FILE_DOCUMENT_SWAGGER = {
  SUMMARY: 'Attach an uploaded file to a course',
  DESCRIPTION: `Step 2 of a file upload. Checks that the file from step 1 is in storage with the declared size and content type, then creates the document. Each upload can be attached once, only by the user who requested it. ${ACCESS_DESCRIPTION}`,
  REQUEST_BODY_DESCRIPTION:
    'The `mediaAssetId` from step 1 and an optional title (defaults to the file name).',
  CREATED_RESPONSE_DESCRIPTION: 'Document created. Returns its id.',
  BODY: {
    MEDIA_ASSET_ID: {
      EXAMPLE: '7d6c5b4a-3f2e-4d1c-8b0a-9f8e7d6c5b4a',
      DESCRIPTION: 'The `mediaAssetId` returned by the upload URL request.',
    },
    TITLE: {
      EXAMPLE: 'Homework week 3',
      DESCRIPTION:
        'Optional title; the original file name is used when omitted.',
    },
  },
  BAD_REQUEST_RESPONSE_DESCRIPTION:
    'Returned when an id is not a valid UUID, the body is invalid, or the file is missing in storage or does not match the declared size or type (MEDIA_ASSET_UPLOAD_INVALID).',
  BAD_REQUEST_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 400,
    errorCode: ERROR_CODE.MEDIA_ASSET_UPLOAD_INVALID,
    message: 'File upload failed. Please try again.',
    path: FILES_PATH,
    timestamp: '2026-09-01T00:00:00.000Z',
  },
  NOT_FOUND_RESPONSE_DESCRIPTION: `Returned when ${COURSE_NOT_FOUND_DESCRIPTION}, or the upload does not exist, was already attached, or was requested by another user (MEDIA_ASSET_NOT_FOUND).`,
  NOT_FOUND_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 404,
    errorCode: ERROR_CODE.MEDIA_ASSET_NOT_FOUND,
    message: 'Upload was not found.',
    path: FILES_PATH,
    timestamp: '2026-09-01T00:00:00.000Z',
  },
} as const;
