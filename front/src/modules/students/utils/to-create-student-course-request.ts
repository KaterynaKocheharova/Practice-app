import type { CreateStudentCourseFormValues } from "../components/create-student-course-form/schema";
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
}: CreateStudentCourseFormValues): CreateStudentCourseRequest => ({
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
