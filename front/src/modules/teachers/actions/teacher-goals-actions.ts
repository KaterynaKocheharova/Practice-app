"use server";

import { refresh } from "next/cache";
import { API_ROUTES, type ServerApiResponse } from "@/modules/common/api";
import { serverApiRequest } from "@/modules/common/api/server-api-request";
import { HttpMethod } from "@/modules/common/common.enums";
import { getTeacherGoalsPageServer } from "../api";
import { TEACHERS_CONFIG } from "../teachers.config";
import type {
  CreateTeacherGoalRequest,
  TeacherGoalIdResponse,
  TeacherGoalsPage,
} from "../types";

export const loadTeacherGoalsPageAction = async (
  offset: number,
): Promise<ServerApiResponse<TeacherGoalsPage>> =>
  getTeacherGoalsPageServer({
    limit: TEACHERS_CONFIG.pagination.pageSize,
    offset,
  });

export const createTeacherGoalAction = async (
  data: CreateTeacherGoalRequest,
): Promise<ServerApiResponse<TeacherGoalIdResponse>> => {
  const response = await serverApiRequest<TeacherGoalIdResponse>(
    API_ROUTES.TEACHERS.MY_GOALS,
    { body: data, method: HttpMethod.Post },
  );

  if (response.ok) {
    refresh();
  }

  return response;
};

export const deleteTeacherGoalAction = async (
  goalId: string,
): Promise<ServerApiResponse<void>> => {
  const response = await serverApiRequest<void>(
    API_ROUTES.TEACHERS.MY_GOAL_BY_ID(goalId),
    { method: HttpMethod.Delete },
  );

  if (response.ok) {
    refresh();
  }

  return response;
};
