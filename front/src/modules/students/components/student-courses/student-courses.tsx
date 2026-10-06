import { StudentCourseLanguageFilter } from "../student-course-language-filter/student-course-language-filter";
import { StudentCoursesList } from "../student-courses-list/student-courses-list";
import { studentCoursesStyles } from "./style";
import type { StudentCoursesProps } from "./types";

export const StudentCourses = ({
  action,
  language,
  studentId,
  title,
  titleLevel: Title,
  viewerRole,
}: StudentCoursesProps) => (
  <section className={studentCoursesStyles.root}>
    <div className={studentCoursesStyles.header}>
      <Title className={studentCoursesStyles.title[Title]}>{title}</Title>
      {action}
    </div>
    <StudentCourseLanguageFilter language={language} />
    <StudentCoursesList
      language={language}
      studentId={studentId}
      viewerRole={viewerRole}
    />
  </section>
);
