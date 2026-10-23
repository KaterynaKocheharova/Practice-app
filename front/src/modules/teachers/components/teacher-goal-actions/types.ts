import type { TeacherGoalCard } from "../../types";

export interface TeacherGoalActionsProps {
  goal: Pick<
    TeacherGoalCard,
    "completedAt" | "id" | "progressCheckDue" | "title"
  >;
}
