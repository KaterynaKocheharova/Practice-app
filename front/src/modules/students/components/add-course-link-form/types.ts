import type { GetStudentCourseRequest } from "../../types";

export interface AddCourseLinkFormProps {
  course: GetStudentCourseRequest;
  /** Called after a successful add, e.g. to close the add panel. */
  onAdded: () => void;
}
