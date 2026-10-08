import type { StudentCourseCard } from "../../types";

export type StudentCourseDetailsHeaderProps = Pick<
  StudentCourseCard,
  "language" | "learningGoals"
>;
