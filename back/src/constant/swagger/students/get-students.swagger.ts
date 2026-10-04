import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { authConfig } from 'src/modules/auth/config';

const STUDENTS_PATH = '/students';

export const GET_STUDENTS_SWAGGER = {
  SUMMARY: 'List my students',
  DESCRIPTION:
    "Returns a page of the calling teacher's students, newest first. A student belongs to the teacher who created them or who teaches them a course. With `search`, only students whose name or email starts with the text are returned (case-insensitive).",
  COOKIE_AUTH_NAME: authConfig.COOKIES.ACCESS_TOKEN,
  QUERY: {
    LIMIT: {
      EXAMPLE: 20,
      DESCRIPTION: 'Maximum number of students to return.',
    },
    OFFSET: {
      EXAMPLE: 0,
      DESCRIPTION: 'Number of students to skip.',
    },
    SEARCH: {
      EXAMPLE: 'an',
      DESCRIPTION:
        'Start of a student name or email (e.g. "an" matches "Anna Kovalenko" and "andrew@example.com").',
    },
  },
  OK_RESPONSE_DESCRIPTION:
    'A page of student cards and the total number of matching students.',
  OK_RESPONSE_EXAMPLE: {
    items: [
      {
        id: '3f1c2b7e-8a4d-4c9e-9b21-6d5e7f8a9b0c',
        name: 'Anna Kovalenko',
        job: 'Software engineer',
        hobbies: ['reading', 'hiking'],
      },
    ],
    total: 1,
  },
  BAD_REQUEST_RESPONSE_DESCRIPTION:
    'Returned when limit, offset or search is invalid.',
  UNAUTHORIZED_RESPONSE_DESCRIPTION:
    'Returned when the access token is missing, invalid, or the user is not active.',
  UNAUTHORIZED_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 401,
    errorCode: ERROR_CODE.INVALID_ACCESS_TOKEN,
    message: 'Invalid access token.',
    path: STUDENTS_PATH,
    timestamp: '2026-09-01T00:00:00.000Z',
  },
  FORBIDDEN_RESPONSE_DESCRIPTION:
    'Returned when the calling user is not a teacher.',
} as const;
