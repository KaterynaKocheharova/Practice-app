"use client";

import { Loader } from "@/modules/common/components";
import { ERRORS, TEXTS } from "@/modules/common/constants";
import { useStudentCourse } from "../../hooks";
import { STUDENTS_CONFIG } from "../../students.config";
import { EditStudentCourseForm } from "../edit-student-course-form/edit-student-course-form";
import { StudentResourceError } from "../student-resource-error/student-resource-error";
import { StudentsPageHeader } from "../students-page-header/students-page-header";
import { editStudentCourseStyles } from "./style";
import type { EditStudentCourseProps } from "./types";

const { languages } = STUDENTS_CONFIG.courseLabels;

export const EditStudentCourse = ({
  courseId,
  studentId,
}: EditStudentCourseProps) => {
  const {
    data: course,
    error,
    isPending,
    refetch,
  } = useStudentCourse({ courseId, studentId });

  if (isPending) {
    return <Loader className={editStudentCourseStyles.skeleton} />;
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

  return (
    <div className={editStudentCourseStyles.root}>
      <StudentsPageHeader
        title={TEXTS.COURSES.EDIT_COURSE_TITLE(languages[course.language])}
      />
      <EditStudentCourseForm course={course} studentId={studentId} />
    </div>
  );
};
