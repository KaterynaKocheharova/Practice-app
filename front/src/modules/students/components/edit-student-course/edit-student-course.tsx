import { ERRORS, TEXTS } from "@/modules/common/constants";
import { getStudentCourseServer } from "../../api";
import { STUDENTS_CONFIG } from "../../students.config";
import { EditStudentCourseForm } from "../edit-student-course-form/edit-student-course-form";
import { StudentResourceError } from "../student-resource-error/student-resource-error";
import { StudentsPageHeader } from "../students-page-header/students-page-header";
import { editStudentCourseStyles } from "./style";
import type { EditStudentCourseProps } from "./types";

const { languages } = STUDENTS_CONFIG.courseLabels;

export const EditStudentCourse = async ({
  courseId,
  studentId,
}: EditStudentCourseProps) => {
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

  const course = response.data;

  return (
    <div className={editStudentCourseStyles.root}>
      <StudentsPageHeader
        title={TEXTS.COURSES.EDIT_COURSE_TITLE(languages[course.language])}
      />
      <EditStudentCourseForm course={course} studentId={studentId} />
    </div>
  );
};
