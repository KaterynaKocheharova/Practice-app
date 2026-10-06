import { studentCourseDetailsSectionStyles } from "./style";
import type { StudentCourseDetailsSectionProps } from "./types";

export const StudentCourseDetailsSection = ({
  children,
  title,
}: StudentCourseDetailsSectionProps) => (
  <section className={studentCourseDetailsSectionStyles.root}>
    <h2 className={studentCourseDetailsSectionStyles.title}>{title}</h2>
    {children}
  </section>
);
