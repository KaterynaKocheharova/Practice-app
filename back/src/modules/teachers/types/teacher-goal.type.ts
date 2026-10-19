import type { TeacherGoalStatus } from '../enums';
import { teacherGoals } from '../schemas/schema';

type TeacherGoalInsertData = typeof teacherGoals.$inferInsert;
type TeacherGoalRowData = typeof teacherGoals.$inferSelect;

export type CreateTeacherGoalData = Pick<
  TeacherGoalInsertData,
  'teacherId' | 'title' | 'details'
>;

export type UpdateTeacherGoalData = Partial<
  Pick<TeacherGoalInsertData, 'title' | 'details'>
>;

export type TeacherGoalLookupParams = {
  goalId: string;
  teacherId: string;
};

export type TeacherGoalsFilterParams = {
  teacherId: string;
  status: TeacherGoalStatus | null;
};

export type TeacherGoalsPageParams = TeacherGoalsFilterParams & {
  limit: number;
  offset: number;
};

export type TeacherGoalIdResponse = Pick<TeacherGoalRowData, 'id'>;

export type TeacherGoalCardResponse = Pick<
  TeacherGoalRowData,
  'id' | 'title' | 'details' | 'completedAt' | 'createdAt'
> & {
  attemptCount: number;
};

export type TeacherGoalsPageResponse = {
  items: TeacherGoalCardResponse[];
  total: number;
};
