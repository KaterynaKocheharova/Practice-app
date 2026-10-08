import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { authConfig } from 'src/modules/auth/config';

const COURSE_PATH = '/students/{studentId}/courses/{courseId}';

export const GET_STUDENT_LANGUAGE_COURSE_BY_ID_SWAGGER = {
  SUMMARY: 'Get student language course',
  DESCRIPTION:
    "Returns one language course. A teacher can open only a course they teach and gets all fields, including comments. The student themselves can open any of their courses and gets the same fields without the teacher's comments.",
  COOKIE_AUTH_NAME: authConfig.COOKIES.ACCESS_TOKEN,
  STUDENT_ID_DESCRIPTION: 'Id of the student.',
  COURSE_ID_DESCRIPTION: 'Id of the course.',
  OK_RESPONSE_DESCRIPTION:
    'Course details. `comments` is present only when the caller is the teacher.',
  OK_RESPONSE_EXAMPLE: {
    id: '9b8a7c6d-5e4f-4a3b-8c2d-1e0f9a8b7c6d',
    language: 'english',
    learningGoals: ['conversation', 'business'],
    specialGoal: 'Prepare for a job interview in English.',
    grammarLevel: 'b1',
    vocabularyLevel: 'b1_plus',
    speakingLevel: 'a2_plus',
    readingLevel: 'b2',
    listeningLevel: 'b1',
    comments: 'Prefers evening lessons.',
  },
  BAD_REQUEST_RESPONSE_DESCRIPTION:
    'Returned when the student id or course id is not a valid UUID.',
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
  NOT_FOUND_RESPONSE_DESCRIPTION:
    'Returned when the student is not accessible to the caller (STUDENT_NOT_FOUND), or the course does not exist, belongs to another student, or is taught by another teacher (STUDENT_LANGUAGE_COURSE_NOT_FOUND).',
  NOT_FOUND_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 404,
    errorCode: ERROR_CODE.STUDENT_LANGUAGE_COURSE_NOT_FOUND,
    message: 'Course was not found.',
    path: COURSE_PATH,
    timestamp: '2026-09-01T00:00:00.000Z',
  },
} as const;
