import { TEACHERS_CONFIG } from "../../teachers.config";
import { teacherGoalsListEmptyStyles } from "./style";
import type { TeacherGoalsListEmptyProps } from "./types";

export const TeacherGoalsListEmpty = ({
  status,
}: TeacherGoalsListEmptyProps) => (
  <p className={teacherGoalsListEmptyStyles.root}>
    {TEACHERS_CONFIG.goalLabels.emptyMessages[status]}
  </p>
);
