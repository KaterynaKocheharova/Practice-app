import type { GoalProgressStatus, TeacherGoalStatus } from "../teachers.enums";

export interface TeacherGoalCard {
  id: string;
  title: string;
  details: string | null;
  completedAt: string | null;
  createdAt: string;
  attemptCount: number;
  progressCheckDue: boolean;
}

export interface TeacherGoalsPage {
  items: TeacherGoalCard[];
  total: number;
  activeTotal: number;
  maxActive: number;
}

export interface GetTeacherGoalsRequest {
  limit: number;
  offset: number;
  status: TeacherGoalStatus;
}

export type CreateTeacherGoalRequest = Pick<TeacherGoalCard, "title"> &
  Partial<{ details: string }>;

export interface CreateTeacherGoalProgressCheckRequest {
  status: GoalProgressStatus;
}

export interface TeacherGoalIdResponse {
  id: string;
}
