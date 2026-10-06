"use client";

import { useQuery } from "@tanstack/react-query";
import { getStudentCourse } from "../api";
import { STUDENTS_CONFIG } from "../students.config";
import type { GetStudentCourseRequest } from "../types";

export const useStudentCourse = ({
  courseId,
  studentId,
}: GetStudentCourseRequest) =>
  useQuery({
    queryKey: STUDENTS_CONFIG.queryKeys.course(studentId, courseId),
    queryFn: () => getStudentCourse({ courseId, studentId }),
  });
