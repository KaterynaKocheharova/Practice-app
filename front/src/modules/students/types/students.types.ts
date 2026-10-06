import type { UserRole } from "@/modules/auth/auth.enums";
import type {
  CourseSkill,
  Language,
  LanguageLevel,
  LearningGoal,
} from "../students.enums";

export interface StudentCard {
  id: string;
  name: string;
  job: string | null;
  hobbies: string[] | null;
}

export interface StudentsPage {
  items: StudentCard[];
  total: number;
}

export interface GetStudentsRequest {
  limit: number;
  offset: number;
}

export interface CreateStudentRequest {
  name: string;
  email?: string;
  birthDate?: string;
  job?: string;
  hobbies?: string[];
}

export interface CreateStudentResponse {
  id: string;
}

export interface StudentDetails extends StudentCard {
  email: string | null;
  birthDate: string | null;
}

export interface StudentCourseCard {
  id: string;
  language: Language;
  learningGoal: LearningGoal | null;
}

export interface GetStudentCoursesRequest {
  studentId: string;
  language: Language | null;
}

export interface GetStudentCourseRequest {
  studentId: string;
  courseId: string;
}

export type StudentCourseLevels = Record<CourseSkill, LanguageLevel | null>;

/** The course as the student sees it: without the teacher's comments. */
export type StudentCourseStudentView = StudentCourseCard &
  StudentCourseLevels & {
    specialGoal: string | null;
  };

/** The course as its teacher sees it. */
export type StudentCourseTeacherView = StudentCourseStudentView & {
  comments: string | null;
};

export type StudentCourseDetails =
  StudentCourseStudentView | StudentCourseTeacherView;

export type CreateStudentCourseRequest = Pick<StudentCourseCard, "language"> &
  Partial<{
    comments: string;
    learningGoal: LearningGoal;
    specialGoal: string;
  }> &
  Partial<Record<CourseSkill, LanguageLevel>>;

export interface CreateStudentCourseResponse {
  id: string;
}

export interface CourseHrefParams extends GetStudentCourseRequest {
  viewerRole: UserRole;
}
