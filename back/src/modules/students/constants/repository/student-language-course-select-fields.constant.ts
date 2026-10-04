import { studentLanguageCourses } from '../../schemas/schema';

export const studentLanguageCourseCardSelectFields = {
  id: studentLanguageCourses.id,
  language: studentLanguageCourses.language,
  learningGoal: studentLanguageCourses.learningGoal,
};

/** Course details as seen by the student: the teacher's comments are excluded. */
export const studentLanguageCourseStudentViewSelectFields = {
  id: studentLanguageCourses.id,
  language: studentLanguageCourses.language,
  learningGoal: studentLanguageCourses.learningGoal,
  specialGoal: studentLanguageCourses.specialGoal,
  grammarLevel: studentLanguageCourses.grammarLevel,
  vocabularyLevel: studentLanguageCourses.vocabularyLevel,
  speakingLevel: studentLanguageCourses.speakingLevel,
  readingLevel: studentLanguageCourses.readingLevel,
  listeningLevel: studentLanguageCourses.listeningLevel,
};

export const studentLanguageCourseDetailsSelectFields = {
  ...studentLanguageCourseStudentViewSelectFields,
  comments: studentLanguageCourses.comments,
};
