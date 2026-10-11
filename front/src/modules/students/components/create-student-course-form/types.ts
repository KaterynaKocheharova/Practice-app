import type { Language } from "../../students.enums";

export interface CreateStudentCourseFormProps {
  /** `null` when the server could not load them. */
  availableLanguages: Language[] | null;
  studentId: string;
}
