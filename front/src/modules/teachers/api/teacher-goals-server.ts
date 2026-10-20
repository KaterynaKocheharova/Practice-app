import "server-only";

import { cache } from "react";
import { API_ROUTES, type ServerApiResponse } from "@/modules/common/api";
import { serverApiRequest } from "@/modules/common/api/server-api-request";
import { TeachersQueryParam } from "../teachers.enums";
import type { GetTeacherGoalsRequest, TeacherGoalsPage } from "../types";

const getTeacherGoalsPage = cache(
  (
    limit: number,
    offset: number,
  ): Promise<ServerApiResponse<TeacherGoalsPage>> => {
    const searchParams = new URLSearchParams({
      [TeachersQueryParam.Limit]: String(limit),
      [TeachersQueryParam.Offset]: String(offset),
    });

    return serverApiRequest<TeacherGoalsPage>(
      `${API_ROUTES.TEACHERS.MY_GOALS}?${searchParams.toString()}`,
    );
  },
);

export const getTeacherGoalsPageServer = ({
  limit,
  offset,
}: GetTeacherGoalsRequest): Promise<ServerApiResponse<TeacherGoalsPage>> =>
  getTeacherGoalsPage(limit, offset);
