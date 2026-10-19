import { teacherGoals } from '../../schemas/schema';

export const teacherGoalIdSelectFields = {
  id: teacherGoals.id,
};

export const teacherGoalCardSelectFields = {
  id: teacherGoals.id,
  title: teacherGoals.title,
  details: teacherGoals.details,
  completedAt: teacherGoals.completedAt,
  createdAt: teacherGoals.createdAt,
};
