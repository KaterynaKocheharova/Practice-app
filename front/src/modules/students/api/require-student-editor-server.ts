import "server-only";

import { notFound, redirect } from "next/navigation";
import { UserRole } from "@/modules/auth/auth.enums";
import { requireRoleServer } from "@/modules/auth/api/require-role-server";
import { APP_ROUTES, ERRORS } from "@/modules/common/constants";
import type { StudentEditorContext } from "../types";
import { getStudentEditPageContent, isMissingResourceStatus } from "../utils";
import { getStudentServer } from "./students-server";

/**
 * Edit-page guard. A student may only open their own edit page; the backend's
 * `isEditable` decides the rest (creating teacher while managed, the student
 * once they have their own account). Not editable: back to where the viewer
 * came from.
 */
export const requireStudentEditorServer = async (
  studentId: string,
): Promise<StudentEditorContext> => {
  const [currentUser, response] = await Promise.all([
    requireRoleServer(UserRole.Teacher, UserRole.Student),
    getStudentServer(studentId),
  ]);

  if (currentUser.role === UserRole.Student && currentUser.id !== studentId) {
    redirect(APP_ROUTES.STUDENT_EDIT(currentUser.id));
  }

  if (!response.ok && isMissingResourceStatus(response.status)) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(ERRORS.STUDENTS.LOAD_STUDENT_FAILED);
  }

  const student = response.data;

  if (!student.isEditable) {
    redirect(getStudentEditPageContent(currentUser.role, studentId).returnHref);
  }

  return { currentUser, student };
};
