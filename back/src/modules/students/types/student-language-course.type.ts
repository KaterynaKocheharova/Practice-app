import { studentLanguageCourses } from '../schemas/schema';
import type { StudentAccessParams } from './student.type';

type StudentLanguageCourseRowData = typeof studentLanguageCourses.$inferSelect;

export type CreateStudentLanguageCourseData =
  typeof studentLanguageCourses.$inferInsert;

export type CreatedStudentLanguageCourseResponse = Pick<
  StudentLanguageCourseRowData,
  'id'
>;

export type StudentLanguageCourseKey = Pick<
  StudentLanguageCourseRowData,
  'studentId' | 'language'
> & {
  teacherId: string;
};

export type StudentLanguageCourseLookupParams = {
  courseId: string;
  studentId: string;
};

export type TeacherStudentLanguageCourseLookupParams =
  StudentLanguageCourseLookupParams & {
    teacherId: string;
  };

export type StudentLanguageCourseViewParams = StudentAccessParams & {
  courseId: string;
};

export type StudentLanguageCourseCardResponse = Pick<
  StudentLanguageCourseRowData,
  'id' | 'language' | 'learningGoal'
>;

export type StudentLanguageCourseStudentViewResponse = Pick<
  StudentLanguageCourseRowData,
  | 'id'
  | 'language'
  | 'learningGoal'
  | 'specialGoal'
  | 'grammarLevel'
  | 'vocabularyLevel'
  | 'speakingLevel'
  | 'readingLevel'
  | 'listeningLevel'
>;

export type StudentLanguageCourseDetailsResponse =
  StudentLanguageCourseStudentViewResponse &
    Pick<StudentLanguageCourseRowData, 'comments'>;
