export interface TeacherGoalCard {
  id: string;
  title: string;
  details: string | null;
  completedAt: string | null;
  createdAt: string;
  attemptCount: number;
}

export interface TeacherGoalsPage {
  items: TeacherGoalCard[];
  total: number;
}

export interface GetTeacherGoalsRequest {
  limit: number;
  offset: number;
}

export type CreateTeacherGoalRequest = Pick<TeacherGoalCard, "title"> &
  Partial<{ details: string }>;

export interface TeacherGoalIdResponse {
  id: string;
}
