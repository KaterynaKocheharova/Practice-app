import type { StudentCourseFormValues } from "../schemas";
import type { UpdateStudentCourseRequest } from "../types";

/**
 * Sends every editable field; emptied ones as `null` to clear them. The
 * language identifies the course and is never sent.
 */
export const toUpdateStudentCourseRequest = ({
  comments,
  grammarLevel,
  learningGoal,
  listeningLevel,
  readingLevel,
  speakingLevel,
  specialGoal,
  vocabularyLevel,
}: StudentCourseFormValues): UpdateStudentCourseRequest => ({
  comments: comments || null,
  grammarLevel: grammarLevel || null,
  learningGoal: learningGoal || null,
  listeningLevel: listeningLevel || null,
  readingLevel: readingLevel || null,
  speakingLevel: speakingLevel || null,
  specialGoal: specialGoal || null,
  vocabularyLevel: vocabularyLevel || null,
});
