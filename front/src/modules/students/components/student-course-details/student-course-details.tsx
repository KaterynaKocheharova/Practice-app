"use client";

import { Loader } from "@/modules/common/components";
import { ERRORS } from "@/modules/common/constants";
import { useStudentCourse } from "../../hooks";
import { StudentCourseDetailsCard } from "../student-course-details-card/student-course-details-card";
import { StudentResourceError } from "../student-resource-error/student-resource-error";
import { studentCourseDetailsStyles } from "./style";
import type { StudentCourseDetailsProps } from "./types";

export const StudentCourseDetails = ({
  courseId,
  studentId,
}: StudentCourseDetailsProps) => {
  const {
    data: course,
    error,
    isPending,
    refetch,
  } = useStudentCourse({ courseId, studentId });

  if (isPending) {
    return <Loader className={studentCourseDetailsStyles.skeleton} />;
  }

  if (!course) {
    return (
      <StudentResourceError
        error={error}
        loadFailedMessage={ERRORS.COURSES.LOAD_COURSE_FAILED}
        notFoundMessage={ERRORS.COURSES.NOT_FOUND}
        onRetry={() => void refetch()}
      />
    );
  }

  return <StudentCourseDetailsCard course={course} />;
};
