import { STUDENTS_CONFIG } from "../students.config";
import type { LearningGoal } from "../students.enums";

const { learningGoals: learningGoalLabels } = STUDENTS_CONFIG.courseLabels;

/** The goals' labels as one comma-separated line, in the stored order. */
export const formatLearningGoals = (learningGoals: LearningGoal[]): string =>
  learningGoals.map((goal) => learningGoalLabels[goal]).join(", ");
