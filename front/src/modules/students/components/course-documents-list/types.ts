import type { CourseDocument, GetStudentCourseRequest } from "../../types";

export interface CourseDocumentsListProps {
  course: GetStudentCourseRequest;
  documents: CourseDocument[];
}
