import "server-only";

import { notFound, redirect } from "next/navigation";
import { UserRole } from "@/modules/auth/auth.enums";
import { requireRoleServer } from "@/modules/auth/api/require-role-server";
import { APP_ROUTES } from "@/modules/common/constants";
import type { StudentEditorContext } from "../types";
import { getStudentEditPageContent, isManagedStudent } from "../utils";
import { getStudentServer } from "./get-student-server";

/**
 * Edit-page guard. A student may only open their own edit page; a teacher
 * only while the student is managed. Otherwise: back to where the viewer came
 * from. The backend still enforces the full rule on save.
 */
export const requireStudentEditorServer = async (
  studentId: string,
): Promise<StudentEditorContext> => {
  const currentUser = await requireRoleServer(
    UserRole.Teacher,
    UserRole.Student,
  );

  if (currentUser.role === UserRole.Student && currentUser.id !== studentId) {
    redirect(APP_ROUTES.STUDENT_EDIT(currentUser.id));
  }

  const student = await getStudentServer(studentId);

  if (!student) {
    notFound();
  }

  if (currentUser.role === UserRole.Teacher && !isManagedStudent(student)) {
    redirect(getStudentEditPageContent(currentUser.role, studentId).returnHref);
  }

  return { currentUser, student };
};
