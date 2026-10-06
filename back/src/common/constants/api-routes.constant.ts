const ROUTE_PARAMS = {
  STUDENT_ID: 'studentId',
  COURSE_ID: 'courseId',
} as const;

export const API_ROUTES = {
  AUTH: {
    ROOT: 'auth',
    SIGN_UP: 'sign-up',
    SIGN_IN: 'sign-in',
    VERIFY_SIGNUP: 'verify-signup',
    VERIFY_SIGNIN: 'verify-signin',
    REFRESH: 'refresh',
    LOGOUT: 'logout',
    CHANGE_PASSWORD: 'change-password',
    GOOGLE_SIGN_IN: 'google/sign-in',
    GOOGLE_SIGN_UP: 'google/sign-up',
    GOOGLE_CALLBACK: 'google/callback',
  },
  USERS: {
    ROOT: 'users',
    ME: 'me',
  },
  STUDENTS: {
    ROOT: 'students',
    PARAMS: ROUTE_PARAMS,
    STUDENT_BY_ID: `:${ROUTE_PARAMS.STUDENT_ID}`,
    AVAILABLE_COURSE_LANGUAGES: `:${ROUTE_PARAMS.STUDENT_ID}/available-course-languages`,
    LANGUAGE_COURSES: `:${ROUTE_PARAMS.STUDENT_ID}/courses`,
    LANGUAGE_COURSE_BY_ID: `:${ROUTE_PARAMS.STUDENT_ID}/courses/:${ROUTE_PARAMS.COURSE_ID}`,
  },
} as const;
