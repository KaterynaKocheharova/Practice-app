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

type StudentLanguageCourseLanguageFilter = {
  /** Only courses in this language; `null` keeps every language. */
  language: StudentLanguageCourseRowData['language'] | null;
};

export type StudentLanguageCoursesFilterParams = StudentAccessParams &
  StudentLanguageCourseLanguageFilter;

export type StudentLanguageCourseCardsParams =
  StudentLanguageCourseLanguageFilter & {
    studentId: string;
  };

export type TeacherStudentLanguageCourseCardsParams =
  StudentLanguageCourseCardsParams & {
    teacherId: string;
  };

export type StudentLanguageCourseCardResponse = Pick<
  StudentLanguageCourseRowData,
  'id' | 'language' | 'learningGoals'
>;

export type StudentLanguageCourseStudentViewResponse = Pick<
  StudentLanguageCourseRowData,
  | 'id'
  | 'language'
  | 'learningGoals'
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

export type UpdateStudentLanguageCourseData = Partial<
  Pick<
    CreateStudentLanguageCourseData,
    | 'learningGoals'
    | 'specialGoal'
    | 'comments'
    | 'grammarLevel'
    | 'vocabularyLevel'
    | 'speakingLevel'
    | 'readingLevel'
    | 'listeningLevel'
  >
>;

export type UpdatedStudentLanguageCourseResponse = Pick<
  StudentLanguageCourseRowData,
  'id'
>;
