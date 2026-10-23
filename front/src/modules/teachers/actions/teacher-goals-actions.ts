"use server";

import { refresh } from "next/cache";
import { API_ROUTES, type ServerApiResponse } from "@/modules/common/api";
import { serverApiRequest } from "@/modules/common/api/server-api-request";
import { HttpMethod } from "@/modules/common/common.enums";
import { getTeacherGoalsPageServer } from "../api";
import { TEACHERS_CONFIG } from "../teachers.config";
import type { TeacherGoalStatus } from "../teachers.enums";
import type {
  CreateTeacherGoalProgressCheckRequest,
  CreateTeacherGoalRequest,
  TeacherGoalIdResponse,
  TeacherGoalsPage,
} from "../types";

const refreshOnSuccess = <TData>(
  response: ServerApiResponse<TData>,
): ServerApiResponse<TData> => {
  if (response.ok) {
    refresh();
  }

  return response;
};

export const loadTeacherGoalsPageAction = async (
  offset: number,
  status: TeacherGoalStatus,
): Promise<ServerApiResponse<TeacherGoalsPage>> =>
  getTeacherGoalsPageServer({
    limit: TEACHERS_CONFIG.pagination.pageSize,
    offset,
    status,
  });

export const createTeacherGoalAction = async (
  data: CreateTeacherGoalRequest,
): Promise<ServerApiResponse<TeacherGoalIdResponse>> =>
  refreshOnSuccess(
    await serverApiRequest<TeacherGoalIdResponse>(
      API_ROUTES.TEACHERS.MY_GOALS,
      { body: data, method: HttpMethod.Post },
    ),
  );

export const deleteTeacherGoalAction = async (
  goalId: string,
): Promise<ServerApiResponse<void>> =>
  refreshOnSuccess(
    await serverApiRequest<void>(API_ROUTES.TEACHERS.MY_GOAL_BY_ID(goalId), {
      method: HttpMethod.Delete,
    }),
  );

export const addTeacherGoalAttemptAction = async (
  goalId: string,
): Promise<ServerApiResponse<void>> =>
  refreshOnSuccess(
    await serverApiRequest<void>(API_ROUTES.TEACHERS.MY_GOAL_ATTEMPTS(goalId), {
      method: HttpMethod.Post,
    }),
  );

export const createTeacherGoalProgressCheckAction = async (
  goalId: string,
  data: CreateTeacherGoalProgressCheckRequest,
): Promise<ServerApiResponse<TeacherGoalIdResponse>> =>
  refreshOnSuccess(
    await serverApiRequest<TeacherGoalIdResponse>(
      API_ROUTES.TEACHERS.MY_GOAL_PROGRESS_CHECKS(goalId),
      { body: data, method: HttpMethod.Post },
    ),
  );

export const completeTeacherGoalAction = async (
  goalId: string,
): Promise<ServerApiResponse<TeacherGoalIdResponse>> =>
  refreshOnSuccess(
    await serverApiRequest<TeacherGoalIdResponse>(
      API_ROUTES.TEACHERS.MY_GOAL_COMPLETION(goalId),
      { method: HttpMethod.Post },
    ),
  );
