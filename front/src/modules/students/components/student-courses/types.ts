import type { ReactNode } from "react";
import type { StudentsHeadingLevel } from "../../students.enums";
import type { StudentCoursesListProps } from "../student-courses-list/types";

export interface StudentCoursesProps extends StudentCoursesListProps {
  action?: ReactNode;
  title: string;
  titleLevel: StudentsHeadingLevel;
}
