import { ERRORS, TEXTS } from "@/modules/common/constants";
import { getStudentCoursesServer } from "../../api";
import { getCourseHref } from "../../utils";
import { StudentCourseCard } from "../student-course-card/student-course-card";
import { StudentResourceError } from "../student-resource-error/student-resource-error";
import { studentCoursesListStyles } from "./style";
import type { StudentCoursesListProps } from "./types";

export const StudentCoursesList = async ({
  language,
  studentId,
  viewerRole,
}: StudentCoursesListProps) => {
  const response = await getStudentCoursesServer({ language, studentId });

  if (!response.ok) {
    return (
      <StudentResourceError
        loadFailedMessage={ERRORS.COURSES.LOAD_FAILED}
        notFoundMessage={ERRORS.STUDENTS.NOT_FOUND}
        status={response.status}
      />
    );
  }

  const courses = response.data;

  return (
    <div className={studentCoursesListStyles.root}>
      <p className={studentCoursesListStyles.status} role="status">
        {TEXTS.COURSES.COURSES_FOUND(courses.length)}
      </p>
      {courses.length === 0 ? (
        <p className={studentCoursesListStyles.empty}>
          {language ? TEXTS.COURSES.EMPTY_FOR_LANGUAGE : TEXTS.COURSES.EMPTY}
        </p>
      ) : (
        <ul
          aria-label={TEXTS.COURSES.LIST_LABEL}
          className={studentCoursesListStyles.grid}
        >
          {courses.map((course) => (
            <li key={course.id}>
              <StudentCourseCard
                course={course}
                href={getCourseHref({
                  courseId: course.id,
                  studentId,
                  viewerRole,
                })}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
