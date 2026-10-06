"use client";

import { Loader } from "@/modules/common/components";
import { ERRORS } from "@/modules/common/constants";
import { useStudent } from "../../hooks";
import { StudentDetailsCard } from "../student-details-card/student-details-card";
import { StudentResourceError } from "../student-resource-error/student-resource-error";
import { studentDetailsStyles } from "./style";
import type { StudentDetailsProps } from "./types";

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

  return <StudentDetailsCard student={student} />;
};
