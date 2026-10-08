import { TEXTS } from "@/modules/common/constants";
import { STUDENTS_CONFIG } from "../../students.config";
import { formatLearningGoals } from "../../utils";
import { studentCourseDetailsHeaderStyles } from "./style";
import type { StudentCourseDetailsHeaderProps } from "./types";

const { languages } = STUDENTS_CONFIG.courseLabels;

export const StudentCourseDetailsHeader = ({
  language,
  learningGoals,
}: StudentCourseDetailsHeaderProps) => (
  <div className={studentCourseDetailsHeaderStyles.root}>
    <h1 className={studentCourseDetailsHeaderStyles.title}>
      {languages[language]}
    </h1>
    <p className={studentCourseDetailsHeaderStyles.goal}>
      {TEXTS.COURSES.LEARNING_GOALS_TITLE}: {formatLearningGoals(learningGoals)}
    </p>
  </div>
);
