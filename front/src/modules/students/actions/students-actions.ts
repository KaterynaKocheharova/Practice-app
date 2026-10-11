"use server";

import { refresh } from "next/cache";
import { API_ROUTES, type ServerApiResponse } from "@/modules/common/api";
import { serverApiRequest } from "@/modules/common/api/server-api-request";
import { HttpMethod } from "@/modules/common/common.enums";
import { getStudentsPageServer } from "../api";
import { STUDENTS_CONFIG } from "../students.config";
import type {
  CreateStudentRequest,
  CreateStudentResponse,
  StudentsPage,
  UpdateStudentRequest,
  UpdateStudentResponse,
} from "../types";

/** "Load more": the first page is rendered on the server. */
export const loadStudentsPageAction = async (
  offset: number,
): Promise<ServerApiResponse<StudentsPage>> =>
  getStudentsPageServer({
    limit: STUDENTS_CONFIG.pagination.pageSize,
    offset,
  });

export const createStudentAction = async (
  data: CreateStudentRequest,
): Promise<ServerApiResponse<CreateStudentResponse>> => {
  const response = await serverApiRequest<CreateStudentResponse>(
    API_ROUTES.STUDENTS.ROOT,
    { body: data, method: HttpMethod.Post },
  );

  if (response.ok) {
    refresh();
  }

  return response;
};

export const updateStudentAction = async (
  studentId: string,
  data: UpdateStudentRequest,
): Promise<ServerApiResponse<UpdateStudentResponse>> => {
  const response = await serverApiRequest<UpdateStudentResponse>(
    API_ROUTES.STUDENTS.BY_ID(studentId),
    { body: data, method: HttpMethod.Patch },
  );

  if (response.ok) {
    refresh();
  }

  return response;
};
