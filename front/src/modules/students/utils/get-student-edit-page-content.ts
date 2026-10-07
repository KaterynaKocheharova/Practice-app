import { UserRole } from "@/modules/auth/auth.enums";
import { APP_ROUTES, TEXTS } from "@/modules/common/constants";
import type { StudentEditPageContent } from "../types";

/** The teacher returns to the student's profile; the student to their courses. */
export const getStudentEditPageContent = (
  viewerRole: UserRole,
  studentId: string,
): StudentEditPageContent =>
  viewerRole === UserRole.Teacher
    ? {
        backLabel: TEXTS.COURSES.BACK_TO_STUDENT,
        returnHref: APP_ROUTES.STUDENT_DETAILS(studentId),
        title: TEXTS.STUDENTS.EDIT_STUDENT,
      }
    : {
        backLabel: TEXTS.COURSES.BACK_TO_COURSES,
        returnHref: APP_ROUTES.COURSES,
        title: TEXTS.STUDENTS.EDIT_PROFILE,
      };
