const ROUTE_PARAMS = {
  STUDENT_ID: 'studentId',
  COURSE_ID: 'courseId',
  DOCUMENT_ID: 'documentId',
} as const;

const TEACHER_ROUTE_PARAMS = {
  GOAL_ID: 'goalId',
} as const;

const MY_GOAL_BY_ID_ROUTE = `me/goals/:${TEACHER_ROUTE_PARAMS.GOAL_ID}`;

const COURSE_DOCUMENTS_ROUTE = `:${ROUTE_PARAMS.STUDENT_ID}/courses/:${ROUTE_PARAMS.COURSE_ID}/documents`;

export const API_ROUTES = {
  AUTH: {
    ROOT: 'auth',
    REFRESH: 'refresh',
    LOGOUT: 'logout',
    GOOGLE: 'google',
    GOOGLE_CALLBACK: 'google/callback',
    GOOGLE_EXCHANGE: 'google/exchange',
  },
  ONBOARDING: {
    ROOT: 'onboarding',
  },
  USERS: {
    ROOT: 'users',
    ME: 'me',
  },
  TEACHERS: {
    ROOT: 'teachers',
    PARAMS: TEACHER_ROUTE_PARAMS,
    MY_GOALS: 'me/goals',
    MY_GOAL_BY_ID: MY_GOAL_BY_ID_ROUTE,
    MY_GOAL_ATTEMPTS: `${MY_GOAL_BY_ID_ROUTE}/attempts`,
    MY_GOAL_PROGRESS_CHECKS: `${MY_GOAL_BY_ID_ROUTE}/progress-checks`,
    MY_GOAL_COMPLETION: `${MY_GOAL_BY_ID_ROUTE}/complete`,
  },
  STUDENTS: {
    ROOT: 'students',
    PARAMS: ROUTE_PARAMS,
    STUDENT_BY_ID: `:${ROUTE_PARAMS.STUDENT_ID}`,
    AVAILABLE_COURSE_LANGUAGES: `:${ROUTE_PARAMS.STUDENT_ID}/available-course-languages`,
    LANGUAGE_COURSES: `:${ROUTE_PARAMS.STUDENT_ID}/courses`,
    LANGUAGE_COURSE_BY_ID: `:${ROUTE_PARAMS.STUDENT_ID}/courses/:${ROUTE_PARAMS.COURSE_ID}`,
    COURSE_DOCUMENT_UPLOAD_URL: `${COURSE_DOCUMENTS_ROUTE}/upload-url`,
    COURSE_DOCUMENT_FILES: `${COURSE_DOCUMENTS_ROUTE}/files`,
    COURSE_DOCUMENT_LINKS: `${COURSE_DOCUMENTS_ROUTE}/links`,
    COURSE_DOCUMENT_BY_ID: `${COURSE_DOCUMENTS_ROUTE}/:${ROUTE_PARAMS.DOCUMENT_ID}`,
    COURSE_DOCUMENT_DOWNLOAD_URL: `${COURSE_DOCUMENTS_ROUTE}/:${ROUTE_PARAMS.DOCUMENT_ID}/download-url`,
  },
} as const;
