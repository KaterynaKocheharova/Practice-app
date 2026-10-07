import "server-only";

import { API_ROUTES } from "@/modules/common/api";
import { serverApiRequest } from "@/modules/common/api/server-api-request";
import { ERRORS } from "@/modules/common/constants";
import type { StudentDetails } from "../types";
import { isMissingResourceStatus } from "../utils";

export const getStudentServer = async (
  studentId: string,
): Promise<StudentDetails | null> => {
  const response = await serverApiRequest<StudentDetails>(
    API_ROUTES.STUDENTS.BY_ID(studentId),
  );

  if (response.ok) {
    return response.data;
  }

  if (isMissingResourceStatus(response.status)) {
    return null;
  }

  throw new Error(ERRORS.STUDENTS.LOAD_STUDENT_FAILED);
};
