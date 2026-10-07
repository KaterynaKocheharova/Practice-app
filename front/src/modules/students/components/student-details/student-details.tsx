"use client";

import { Loader } from "@/modules/common/components";
import { APP_ROUTES, ERRORS, TEXTS } from "@/modules/common/constants";
import { useStudent } from "../../hooks";
import { EditStudentLink } from "../edit-student-link/edit-student-link";
import { StudentDetailsCard } from "../student-details-card/student-details-card";
import { StudentResourceError } from "../student-resource-error/student-resource-error";
import { studentDetailsStyles } from "./style";
import type { StudentDetailsProps } from "./types";

/** The teacher's view: editing is offered only when the backend allows it. */
export const StudentDetails = ({ studentId }: StudentDetailsProps) => {
  const { data: student, error, isPending, refetch } = useStudent(studentId);

  if (isPending) {
    return <Loader className={studentDetailsStyles.skeleton} />;
  }

  if (!student) {
    return (
      <StudentResourceError
        error={error}
        loadFailedMessage={ERRORS.STUDENTS.LOAD_STUDENT_FAILED}
        notFoundMessage={ERRORS.STUDENTS.NOT_FOUND}
        onRetry={() => void refetch()}
      />
    );
  }

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
