import { TEXTS } from "@/modules/common/constants";
import { AddCourseLinkForm } from "../add-course-link-form/add-course-link-form";
import { CourseDocumentsList } from "../course-documents-list/course-documents-list";
import { StudentCourseDetailsSection } from "../student-course-details-section/student-course-details-section";
import { UploadCourseDocumentForm } from "../upload-course-document-form/upload-course-document-form";
import { courseDocumentsSectionStyles } from "./style";
import type { CourseDocumentsSectionProps } from "./types";

export const CourseDocumentsSection = ({
  course,
  documents,
}: CourseDocumentsSectionProps) => (
  <StudentCourseDetailsSection title={TEXTS.COURSES.DOCUMENTS.TITLE}>
    <div className={courseDocumentsSectionStyles.root}>
      <CourseDocumentsList course={course} documents={documents} />
      <div className={courseDocumentsSectionStyles.forms}>
        <UploadCourseDocumentForm course={course} />
        <AddCourseLinkForm course={course} />
      </div>
    </div>
  </StudentCourseDetailsSection>
);
