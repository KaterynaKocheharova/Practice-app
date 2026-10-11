import { ERRORS } from "@/modules/common/constants";
import { getStudentCourseServer } from "../../api";
import { StudentCourseDetailsCard } from "../student-course-details-card/student-course-details-card";
import { StudentResourceError } from "../student-resource-error/student-resource-error";
import type { StudentCourseDetailsProps } from "./types";

export const StudentCourseDetails = async ({
  courseId,
  studentId,
}: StudentCourseDetailsProps) => {
  const response = await getStudentCourseServer({ courseId, studentId });

  if (!response.ok) {
    return (
      <StudentResourceError
        loadFailedMessage={ERRORS.COURSES.LOAD_COURSE_FAILED}
        notFoundMessage={ERRORS.COURSES.NOT_FOUND}
        status={response.status}
      />
    );
  }

  return (
    <StudentCourseDetailsCard course={response.data} studentId={studentId} />
  );
};
