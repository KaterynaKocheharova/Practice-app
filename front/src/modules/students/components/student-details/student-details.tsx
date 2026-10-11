import { APP_ROUTES, ERRORS, TEXTS } from "@/modules/common/constants";
import { getStudentServer } from "../../api";
import { EditStudentLink } from "../edit-student-link/edit-student-link";
import { StudentDetailsCard } from "../student-details-card/student-details-card";
import { StudentResourceError } from "../student-resource-error/student-resource-error";
import type { StudentDetailsProps } from "./types";

/** The teacher's view: editing is offered only when the backend allows it. */
export const StudentDetails = async ({ studentId }: StudentDetailsProps) => {
  const response = await getStudentServer(studentId);

  if (!response.ok) {
    return (
      <StudentResourceError
        loadFailedMessage={ERRORS.STUDENTS.LOAD_STUDENT_FAILED}
        notFoundMessage={ERRORS.STUDENTS.NOT_FOUND}
        status={response.status}
      />
    );
  }

  const student = response.data;

  return (
    <StudentDetailsCard
      action={
        student.isEditable && (
          <EditStudentLink
            href={APP_ROUTES.STUDENT_EDIT(studentId)}
            label={TEXTS.STUDENTS.EDIT_STUDENT}
          />
        )
      }
      student={student}
    />
  );
};
