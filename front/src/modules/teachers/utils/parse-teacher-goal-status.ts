import { TEACHERS_CONFIG } from "../teachers.config";
import { TeacherGoalStatus } from "../teachers.enums";

const STATUSES = new Set<string>(Object.values(TeacherGoalStatus));

const isTeacherGoalStatus = (value: string): value is TeacherGoalStatus =>
  STATUSES.has(value);

export const parseTeacherGoalStatus = (
  value: string | string[] | undefined,
): TeacherGoalStatus =>
  typeof value === "string" && isTeacherGoalStatus(value)
    ? value
    : TEACHERS_CONFIG.filters.defaultStatus;
