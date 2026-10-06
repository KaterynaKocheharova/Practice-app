"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getStudentCourses } from "../api";
import { STUDENTS_CONFIG } from "../students.config";
import type { GetStudentCoursesRequest } from "../types";

/** Keeps the previous list on screen while another language loads. */
export const useStudentCourses = ({
  language,
  studentId,
}: GetStudentCoursesRequest) =>
  useQuery({
    queryKey: STUDENTS_CONFIG.queryKeys.courseList(studentId, language),
    queryFn: () => getStudentCourses({ language, studentId }),
    placeholderData: keepPreviousData,
  });
