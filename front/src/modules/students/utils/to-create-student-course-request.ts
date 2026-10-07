import type { StudentCourseFormValues } from "../schemas";
import type { CreateStudentCourseRequest } from "../types";

/** Omits empty optional fields: the backend rejects empty strings. */
export const toCreateStudentCourseRequest = ({
  comments,
  grammarLevel,
  language,
  learningGoal,
  listeningLevel,
  readingLevel,
  speakingLevel,
  specialGoal,
  vocabularyLevel,
}: StudentCourseFormValues): CreateStudentCourseRequest => ({
  language,
  ...(learningGoal && { learningGoal }),
  ...(specialGoal && { specialGoal }),
  ...(comments && { comments }),
  ...(grammarLevel && { grammarLevel }),
  ...(vocabularyLevel && { vocabularyLevel }),
  ...(speakingLevel && { speakingLevel }),
  ...(readingLevel && { readingLevel }),
  ...(listeningLevel && { listeningLevel }),
});
