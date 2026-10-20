import type { TeacherGoalCard } from "../types";

export const appendNewGoals = (
  loadedGoals: TeacherGoalCard[],
  nextGoals: TeacherGoalCard[],
): TeacherGoalCard[] => {
  const loadedIds = new Set(loadedGoals.map(({ id }) => id));

  return [...loadedGoals, ...nextGoals.filter(({ id }) => !loadedIds.has(id))];
};
