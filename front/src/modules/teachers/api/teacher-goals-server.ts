import "server-only";

import { cache } from "react";
import { API_ROUTES, type ServerApiResponse } from "@/modules/common/api";
import { serverApiRequest } from "@/modules/common/api/server-api-request";
import { TeacherGoalStatus, TeachersQueryParam } from "../teachers.enums";
import type { GetTeacherGoalsRequest, TeacherGoalsPage } from "../types";

const getTeacherGoalsPage = cache(
  (
    limit: number,
    offset: number,
    status: TeacherGoalStatus,
  ): Promise<ServerApiResponse<TeacherGoalsPage>> => {
    const searchParams = new URLSearchParams({
      [TeachersQueryParam.Limit]: String(limit),
      [TeachersQueryParam.Offset]: String(offset),
      [TeachersQueryParam.Status]: status,
    });

    return serverApiRequest<TeacherGoalsPage>(
      `${API_ROUTES.TEACHERS.MY_GOALS}?${searchParams.toString()}`,
    );
  },
);

export const getTeacherGoalsPageServer = ({
  limit,
  offset,
  status,
}: GetTeacherGoalsRequest): Promise<ServerApiResponse<TeacherGoalsPage>> =>
  getTeacherGoalsPage(limit, offset, status);
