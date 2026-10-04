import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { authConfig } from 'src/modules/auth/config';

const COURSE_PATH = '/students/{studentId}/courses';

export const CREATE_STUDENT_LANGUAGE_COURSE_SWAGGER = {
  SUMMARY: 'Create student language course',
  DESCRIPTION:
    'Creates a language course for a student managed by the calling teacher. A student can have only one course per language with the same teacher.',
  COOKIE_AUTH_NAME: authConfig.COOKIES.ACCESS_TOKEN,
  STUDENT_ID_DESCRIPTION:
    'Id of the student, who must be managed by the calling teacher.',
  REQUEST_BODY_DESCRIPTION:
    'Language is required. Learning goal, special goal, comments and levels are optional.',
  CREATED_RESPONSE_DESCRIPTION:
    'Language course created. Returns the id of the new course.',
  CREATED_RESPONSE_EXAMPLE: {
    id: '9b8a7c6d-5e4f-4a3b-8c2d-1e0f9a8b7c6d',
  },
  BODY: {
    LANGUAGE: {
      EXAMPLE: 'english',
      DESCRIPTION: 'Language being learned.',
    },
    LEARNING_GOAL: {
      EXAMPLE: 'conversation',
      DESCRIPTION: 'Optional main learning goal.',
    },
    SPECIAL_GOAL: {
      EXAMPLE: 'Prepare for a job interview in English.',
      DESCRIPTION: 'Optional free-text goal.',
    },
    COMMENTS: {
      EXAMPLE: 'Prefers evening lessons.',
      DESCRIPTION: 'Optional teacher comments.',
    },
    LEVEL: {
      EXAMPLE: 'b1',
      DESCRIPTION:
        'Optional level for grammar, vocabulary, speaking, reading or listening.',
    },
  },
  BAD_REQUEST_RESPONSE_DESCRIPTION:
    'Returned when the student id is not a valid UUID or the request body is invalid.',
  UNAUTHORIZED_RESPONSE_DESCRIPTION:
    'Returned when the access token is missing, invalid, or the user is not active.',
  UNAUTHORIZED_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 401,
    errorCode: ERROR_CODE.INVALID_ACCESS_TOKEN,
    message: 'Invalid access token.',
    path: COURSE_PATH,
    timestamp: '2026-09-01T00:00:00.000Z',
  },
  FORBIDDEN_RESPONSE_DESCRIPTION:
    'Returned when the calling user is not a teacher.',
  NOT_FOUND_RESPONSE_DESCRIPTION:
    'Returned when the student does not exist or is not managed by the calling teacher.',
  NOT_FOUND_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 404,
    errorCode: ERROR_CODE.STUDENT_NOT_FOUND,
    message: 'Student was not found.',
    path: COURSE_PATH,
    timestamp: '2026-09-01T00:00:00.000Z',
  },
  CONFLICT_RESPONSE_DESCRIPTION:
    'Returned when the student already has a course in this language with the calling teacher.',
  CONFLICT_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 409,
    errorCode: ERROR_CODE.STUDENT_LANGUAGE_COURSE_ALREADY_EXISTS,
    message: 'This student already has a course in this language.',
    path: COURSE_PATH,
    timestamp: '2026-09-01T00:00:00.000Z',
  },
} as const;
