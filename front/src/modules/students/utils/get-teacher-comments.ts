import type { StudentCourseDetails } from "../types";

/** Students get the course without the `comments` field at all. */
export const getTeacherComments = (
  course: StudentCourseDetails,
): string | null => ("comments" in course ? course.comments : null);
