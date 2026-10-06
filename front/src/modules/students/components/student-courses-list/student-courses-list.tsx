"use client";

import { ERRORS, TEXTS } from "@/modules/common/constants";
import { useStudentCourses } from "../../hooks";
import { STUDENTS_CONFIG } from "../../students.config";
import { getCourseHref } from "../../utils";
import { StudentCourseCard } from "../student-course-card/student-course-card";
import { StudentResourceError } from "../student-resource-error/student-resource-error";
import { StudentsListSkeleton } from "../students-list-skeleton/students-list-skeleton";
import { studentCoursesListStyles } from "./style";
import type { StudentCoursesListProps } from "./types";

export const StudentCoursesList = ({
  language,
  studentId,
  viewerRole,
}: StudentCoursesListProps) => {
  const {
    data: courses,
    error,
    isPending,
    isPlaceholderData,
    refetch,
  } = useStudentCourses({ language, studentId });

  if (isPending) {
    return <StudentsListSkeleton count={STUDENTS_CONFIG.skeletons.courses} />;
  }

  if (!courses) {
    return (
      <StudentResourceError
        error={error}
        loadFailedMessage={ERRORS.COURSES.LOAD_FAILED}
        notFoundMessage={ERRORS.STUDENTS.NOT_FOUND}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div
      aria-busy={isPlaceholderData}
      className={studentCoursesListStyles.root(isPlaceholderData)}
    >
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
