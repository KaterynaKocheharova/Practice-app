"use server";

import { refresh } from "next/cache";
import { API_ROUTES, type ServerApiResponse } from "@/modules/common/api";
import { serverApiRequest } from "@/modules/common/api/server-api-request";
import { HttpMethod } from "@/modules/common/common.enums";
import type {
  CreateStudentCourseRequest,
  CreateStudentCourseResponse,
  GetStudentCourseRequest,
  UpdateStudentCourseRequest,
  UpdateStudentCourseResponse,
} from "../types";

export const createStudentCourseAction = async (
  studentId: string,
  data: CreateStudentCourseRequest,
): Promise<ServerApiResponse<CreateStudentCourseResponse>> => {
  const response = await serverApiRequest<CreateStudentCourseResponse>(
    API_ROUTES.STUDENTS.COURSES(studentId),
    { body: data, method: HttpMethod.Post },
  );

  if (response.ok) {
    refresh();
  }

  return response;
};

export const updateStudentCourseAction = async (
  { courseId, studentId }: GetStudentCourseRequest,
  data: UpdateStudentCourseRequest,
): Promise<ServerApiResponse<UpdateStudentCourseResponse>> => {
  const response = await serverApiRequest<UpdateStudentCourseResponse>(
    API_ROUTES.STUDENTS.COURSE_BY_ID(studentId, courseId),
    { body: data, method: HttpMethod.Patch },
  );

  if (response.ok) {
    refresh();
  }

  return response;
};
