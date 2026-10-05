import { API_ROUTES, apiJsonRequest, apiRequest } from "@/modules/common/api";
import { StudentsQueryParam } from "../students.enums";
import type {
  CreateStudentRequest,
  CreateStudentResponse,
  GetStudentsRequest,
  StudentsPage,
} from "../types";

export function getStudents({
  limit,
  offset,
}: GetStudentsRequest): Promise<StudentsPage> {
  const searchParams = new URLSearchParams({
    [StudentsQueryParam.Limit]: String(limit),
    [StudentsQueryParam.Offset]: String(offset),
  });

  return apiRequest<StudentsPage>(
    `${API_ROUTES.STUDENTS.ROOT}?${searchParams.toString()}`,
  );
}

export function createStudent(
  data: CreateStudentRequest,
): Promise<CreateStudentResponse> {
  return apiJsonRequest<CreateStudentResponse, CreateStudentRequest>(
    API_ROUTES.STUDENTS.ROOT,
    data,
    {
      method: "POST",
    },
  );
}
