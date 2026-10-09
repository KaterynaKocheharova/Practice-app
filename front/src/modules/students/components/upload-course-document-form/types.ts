import type { GetStudentCourseRequest } from "../../types";

export interface UploadCourseDocumentFormProps {
  course: GetStudentCourseRequest;
  /** Called after a successful add, e.g. to close the add panel. */
  onAdded: () => void;
}
