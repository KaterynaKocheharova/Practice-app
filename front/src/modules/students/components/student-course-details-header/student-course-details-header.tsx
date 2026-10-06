import { TEXTS } from "@/modules/common/constants";
import { STUDENTS_CONFIG } from "../../students.config";
import { studentCourseDetailsHeaderStyles } from "./style";
import type { StudentCourseDetailsHeaderProps } from "./types";

const { languages, learningGoals } = STUDENTS_CONFIG.courseLabels;

export const StudentCourseDetailsHeader = ({
  language,
  learningGoal,
}: StudentCourseDetailsHeaderProps) => (
  <div className={studentCourseDetailsHeaderStyles.root}>
    <h1 className={studentCourseDetailsHeaderStyles.title}>
      {languages[language]}
    </h1>
    {learningGoal && (
      <p className={studentCourseDetailsHeaderStyles.goal}>
        {TEXTS.COURSES.LEARNING_GOAL}: {learningGoals[learningGoal]}
      </p>
    )}
  </div>
);
