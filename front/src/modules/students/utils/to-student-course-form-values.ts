import type { StudentCourseFormInput } from "../schemas";
import type { StudentCourseDetails } from "../types";
import { getTeacherComments } from "./get-teacher-comments";

/** Prefills the course form: inputs and selects need strings, not `null`. */
export const toStudentCourseFormValues = (
  course: StudentCourseDetails,
): StudentCourseFormInput => ({
  comments: getTeacherComments(course) ?? "",
  grammarLevel: course.grammarLevel ?? "",
  language: course.language,
  learningGoals: course.learningGoals,
  listeningLevel: course.listeningLevel ?? "",
  readingLevel: course.readingLevel ?? "",
  speakingLevel: course.speakingLevel ?? "",
  specialGoal: course.specialGoal ?? "",
  vocabularyLevel: course.vocabularyLevel ?? "",
});
