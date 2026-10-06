import { UserRole } from "@/modules/auth/auth.enums";
import { APP_ROUTES } from "@/modules/common/constants";
import type { CourseHrefParams } from "../types";

/** Teachers open a course under the student; students under their own `/courses`. */
export const getCourseHref = ({
  courseId,
  studentId,
  viewerRole,
}: CourseHrefParams): string =>
  viewerRole === UserRole.Teacher
    ? APP_ROUTES.STUDENT_COURSE_DETAILS(studentId, courseId)
    : APP_ROUTES.COURSE_DETAILS(courseId);
