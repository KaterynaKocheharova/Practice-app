import type { UserRole, UserStatus } from "@/modules/auth/auth.enums";
import type { CurrentUser } from "@/modules/auth/types";
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
  /** Whether the viewer may edit this student, decided by the backend. */
  isEditable: boolean;
  status: UserStatus;
}

export interface StudentCourseCard {
  id: string;
  language: Language;
  learningGoals: LearningGoal[];
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

export type StudentCourseTeacherView = StudentCourseStudentView & {
  comments: string | null;
};

export type StudentCourseDetails =
  StudentCourseStudentView | StudentCourseTeacherView;

export type CreateStudentCourseRequest = Pick<
  StudentCourseCard,
  "language" | "learningGoals"
> &
  Partial<{
    comments: string;
    specialGoal: string;
  }> &
  Partial<Record<CourseSkill, LanguageLevel>>;

export interface CreateStudentCourseResponse {
  id: string;
}

export interface CourseHrefParams extends GetStudentCourseRequest {
  viewerRole: UserRole;
}

export type UpdateStudentRequest = Partial<
  Pick<StudentCard, "name"> &
    Pick<StudentDetails, "birthDate" | "email" | "hobbies" | "job">
>;

export interface UpdateStudentResponse {
  id: string;
}

export type UpdateStudentCourseRequest = Partial<
  Pick<StudentCourseTeacherView, "comments" | "learningGoals" | "specialGoal"> &
    StudentCourseLevels
>;

export interface UpdateStudentCourseResponse {
  id: string;
}

export interface StudentEditPageContent {
  backLabel: string;
  returnHref: string;
  title: string;
}

export interface StudentEditorContext {
  currentUser: CurrentUser;
  student: StudentDetails;
}
