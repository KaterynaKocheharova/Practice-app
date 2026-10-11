const encodeSegment = (segment: string): string => encodeURIComponent(segment);

const courseDocumentsPath = (studentId: string, courseId: string): string =>
  `students/${encodeSegment(studentId)}/courses/${encodeSegment(courseId)}/documents`;

export const API_ROUTES = {
  AUTH: {
    SIGN_UP: "auth/sign-up",
    SIGN_IN: "auth/sign-in",
    VERIFY_SIGNUP: "auth/verify-signup",
    VERIFY_SIGNIN: "auth/verify-signin",
    REFRESH: "auth/refresh",
    LOGOUT: "auth/logout",
    CHANGE_PASSWORD: "auth/change-password",
    GOOGLE_SIGN_IN: "auth/google/sign-in",
    GOOGLE_SIGN_UP: "auth/google/sign-up",
    GOOGLE_EXCHANGE: "auth/google/exchange",
  },
  STUDENTS: {
    ROOT: "students",
    BY_ID: (studentId: string) => `students/${encodeSegment(studentId)}`,
    AVAILABLE_COURSE_LANGUAGES: (studentId: string) =>
      `students/${encodeSegment(studentId)}/available-course-languages`,
    COURSES: (studentId: string) =>
      `students/${encodeSegment(studentId)}/courses`,
    COURSE_BY_ID: (studentId: string, courseId: string) =>
      `students/${encodeSegment(studentId)}/courses/${encodeSegment(courseId)}`,
    COURSE_DOCUMENT_UPLOAD_URL: (studentId: string, courseId: string) =>
      `${courseDocumentsPath(studentId, courseId)}/upload-url`,
    COURSE_DOCUMENT_FILES: (studentId: string, courseId: string) =>
      `${courseDocumentsPath(studentId, courseId)}/files`,
    COURSE_DOCUMENT_LINKS: (studentId: string, courseId: string) =>
      `${courseDocumentsPath(studentId, courseId)}/links`,
    COURSE_DOCUMENT_BY_ID: (
      studentId: string,
      courseId: string,
      documentId: string,
    ) =>
      `${courseDocumentsPath(studentId, courseId)}/${encodeSegment(documentId)}`,
    COURSE_DOCUMENT_DOWNLOAD_URL: (
      studentId: string,
      courseId: string,
      documentId: string,
    ) =>
      `${courseDocumentsPath(studentId, courseId)}/${encodeSegment(documentId)}/download-url`,
  },
  USERS: {
    ME: "users/me",
  },
} as const;
