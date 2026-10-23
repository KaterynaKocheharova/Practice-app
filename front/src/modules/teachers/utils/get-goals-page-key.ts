import type { TeacherGoalStatus } from "../teachers.enums";
import type { TeacherGoalsPage } from "../types";

export const getGoalsPageKey = (
  status: TeacherGoalStatus,
  { items, total }: TeacherGoalsPage,
): string =>
  `${status}:${total}:${items
    .map(
      ({ attemptCount, completedAt, id, progressCheckDue }) =>
        `${id}-${attemptCount}-${progressCheckDue}-${completedAt ?? ""}`,
    )
    .join(",")}`;
