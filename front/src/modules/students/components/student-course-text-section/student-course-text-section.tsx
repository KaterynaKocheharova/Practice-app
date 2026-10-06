import { StudentCourseDetailsSection } from "../student-course-details-section/student-course-details-section";
import { studentCourseTextSectionStyles } from "./style";
import type { StudentCourseTextSectionProps } from "./types";

/** Renders nothing when the course has no text for this section. */
export const StudentCourseTextSection = ({
  text,
  title,
}: StudentCourseTextSectionProps) => {
  if (!text) {
    return null;
  }

  return (
    <StudentCourseDetailsSection title={title}>
      <p className={studentCourseTextSectionStyles.text}>{text}</p>
    </StudentCourseDetailsSection>
  );
};
