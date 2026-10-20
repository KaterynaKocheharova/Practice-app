export const APP_ROUTES = {
  COURSES: "/courses",
  COURSE_DETAILS: (courseId: string) => `/courses/${courseId}`,
  GOALS: "/goals",
  GOOGLE_OAUTH_CALLBACK: "/auth/google/callback",
  INVITE_PENDING: "/invite-pending",
  ONBOARDING: "/onboarding",
  ROOT: "/",
  SIGN_IN: "/sign-in",
  STUDENTS: "/students",
  STUDENTS_NEW: "/students/new",
  STUDENT_COURSE_DETAILS: (studentId: string, courseId: string) =>
    `/students/${studentId}/courses/${courseId}`,
  STUDENT_COURSE_NEW: (studentId: string) =>
    `/students/${studentId}/courses/new`,
  STUDENT_COURSE_EDIT: (studentId: string, courseId: string) =>
    `/students/${studentId}/courses/${courseId}/edit`,
  STUDENT_DETAILS: (studentId: string) => `/students/${studentId}`,
  STUDENT_EDIT: (studentId: string) => `/students/${studentId}/edit`,
} as const;
