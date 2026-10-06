export const APP_ROUTES = {
  COURSES: "/courses",
  COURSE_DETAILS: (courseId: string) => `/courses/${courseId}`,
  GOOGLE_OAUTH_SUCCESS: "/auth/google/success",
  ROOT: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  STUDENTS: "/students",
  STUDENTS_NEW: "/students/new",
  STUDENT_COURSE_DETAILS: (studentId: string, courseId: string) =>
    `/students/${studentId}/courses/${courseId}`,
  STUDENT_COURSE_NEW: (studentId: string) =>
    `/students/${studentId}/courses/new`,
  STUDENT_DETAILS: (studentId: string) => `/students/${studentId}`,
  VERIFY_SIGNIN: "/verify-signin",
  VERIFY_SIGNUP: "/verify-signup",
} as const;
