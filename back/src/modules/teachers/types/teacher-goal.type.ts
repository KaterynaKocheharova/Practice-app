import type {
  GoalProgressStatus,
  TeacherGoalStatus,
  TeacherGoalWriteOutcome,
} from '../enums';
import { teacherGoalProgressChecks, teacherGoals } from '../schemas/schema';

type TeacherGoalInsertData = typeof teacherGoals.$inferInsert;
type TeacherGoalRowData = typeof teacherGoals.$inferSelect;
type TeacherGoalProgressCheckRowData =
  typeof teacherGoalProgressChecks.$inferSelect;

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
  status: TeacherGoalStatus;
};

export type TeacherGoalsPageParams = TeacherGoalsFilterParams & {
  limit: number;
  offset: number;
};

export type TeacherGoalIdResponse = Pick<TeacherGoalRowData, 'id'>;

type TeacherGoalProgressData = {
  attemptCount: number;
  progressCheckDue: boolean;
};

export type TeacherGoalCardResponse = Pick<
  TeacherGoalRowData,
  'id' | 'title' | 'details' | 'completedAt' | 'createdAt'
> &
  TeacherGoalProgressData;

export type TeacherGoalStateData = Pick<TeacherGoalRowData, 'completedAt'> &
  TeacherGoalProgressData;

export type CreateTeacherGoalProgressCheckData = TeacherGoalLookupParams & {
  status: GoalProgressStatus;
};

export type TeacherGoalProgressCheckIdResponse = Pick<
  TeacherGoalProgressCheckRowData,
  'id'
>;

export type TeacherGoalWriteResult<TData> =
  | { outcome: TeacherGoalWriteOutcome.Done; data: TData }
  | { outcome: Exclude<TeacherGoalWriteOutcome, TeacherGoalWriteOutcome.Done> };

export type ActiveTeacherGoalBlocker =
  | TeacherGoalWriteOutcome.AlreadyCompleted
  | TeacherGoalWriteOutcome.ProgressCheckPending;

export type TeacherGoalsPageResponse = {
  items: TeacherGoalCardResponse[];
  total: number;
  activeTotal: number;
  maxActive: number;
};
