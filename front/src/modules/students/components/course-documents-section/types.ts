import type { CourseDocument, GetStudentCourseRequest } from "../../types";

export interface CourseDocumentsSectionProps {
  course: GetStudentCourseRequest;
  documents: CourseDocument[];
}
