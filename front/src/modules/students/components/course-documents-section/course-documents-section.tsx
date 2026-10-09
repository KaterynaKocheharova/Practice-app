import { TEXTS } from "@/modules/common/constants";
import { AddCourseDocumentPanel } from "../add-course-document-panel/add-course-document-panel";
import { CourseDocumentsList } from "../course-documents-list/course-documents-list";
import { StudentCourseDetailsSection } from "../student-course-details-section/student-course-details-section";
import { courseDocumentsSectionStyles } from "./style";
import type { CourseDocumentsSectionProps } from "./types";

export const CourseDocumentsSection = ({
  course,
  documents,
}: CourseDocumentsSectionProps) => (
  <StudentCourseDetailsSection title={TEXTS.COURSES.DOCUMENTS.TITLE}>
    <div className={courseDocumentsSectionStyles.root}>
      <CourseDocumentsList course={course} documents={documents} />
      <AddCourseDocumentPanel course={course} />
    </div>
  </StudentCourseDetailsSection>
);
