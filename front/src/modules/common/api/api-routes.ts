const encodeSegment = (segment: string): string => encodeURIComponent(segment);

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
  },
  USERS: {
    ME: "users/me",
  },
} as const;
