import type { TeacherGoalStatus } from "../../teachers.enums";
import type { TeacherGoalsPage } from "../../types";

export interface TeacherGoalsListProps {
  firstPage: TeacherGoalsPage;
  status: TeacherGoalStatus;
}
