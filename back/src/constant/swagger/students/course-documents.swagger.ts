import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { authConfig } from 'src/modules/auth/config';

export const COURSE_DOCUMENTS_PATH =
  '/students/{studentId}/courses/{courseId}/documents';

const TIMESTAMP = '2026-09-01T00:00:00.000Z';

/** Shared by every course documents endpoint. */
export const COURSE_DOCUMENTS_SWAGGER = {
  COOKIE_AUTH_NAME: authConfig.COOKIES.ACCESS_TOKEN,
  ACCESS_DESCRIPTION:
    'Available to the student the course belongs to and to the teacher who runs the course.',
  STUDENT_ID_DESCRIPTION: 'Id of the student.',
  COURSE_ID_DESCRIPTION: 'Id of the course.',
  DOCUMENT_ID_DESCRIPTION: 'Id of the course document.',
  CREATED_DOCUMENT_EXAMPLE: {
    id: '3c2b1a09-8f7e-4d6c-9b5a-4e3d2c1b0a98',
  },
  UNAUTHORIZED_RESPONSE_DESCRIPTION:
    'Returned when the access token is missing, invalid, or the user is not active.',
  UNAUTHORIZED_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 401,
    errorCode: ERROR_CODE.INVALID_ACCESS_TOKEN,
    message: 'Invalid access token.',
    path: COURSE_DOCUMENTS_PATH,
    timestamp: TIMESTAMP,
  },
  COURSE_NOT_FOUND_DESCRIPTION:
    'the course does not exist, belongs to another student, or is run by another teacher (STUDENT_LANGUAGE_COURSE_NOT_FOUND)',
  COURSE_NOT_FOUND_EXAMPLE: {
    success: false,
    statusCode: 404,
    errorCode: ERROR_CODE.STUDENT_LANGUAGE_COURSE_NOT_FOUND,
    message: 'Course was not found.',
    path: COURSE_DOCUMENTS_PATH,
    timestamp: TIMESTAMP,
  },
  DOCUMENT_NOT_FOUND_EXAMPLE: {
    success: false,
    statusCode: 404,
    errorCode: ERROR_CODE.COURSE_DOCUMENT_NOT_FOUND,
    message: 'Document was not found.',
    path: `${COURSE_DOCUMENTS_PATH}/{documentId}`,
    timestamp: TIMESTAMP,
  },
  LIMIT_REACHED_DESCRIPTION:
    'Returned when the course already has the maximum number of documents (100).',
  LIMIT_REACHED_EXAMPLE: {
    success: false,
    statusCode: 409,
    errorCode: ERROR_CODE.COURSE_DOCUMENTS_LIMIT_REACHED,
    message: 'This course already has the maximum number of documents.',
    path: COURSE_DOCUMENTS_PATH,
    timestamp: TIMESTAMP,
  },
} as const;
