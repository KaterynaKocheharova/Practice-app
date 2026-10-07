"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStudentCourse } from "../api";
import { STUDENTS_CONFIG } from "../students.config";
import type {
  GetStudentCourseRequest,
  UpdateStudentCourseRequest,
} from "../types";

/** Refreshes the student's course queries: the course and its list card change. */
export const useUpdateStudentCourse = (course: GetStudentCourseRequest) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateStudentCourseRequest) =>
      updateStudentCourse(course, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: STUDENTS_CONFIG.queryKeys.courses(course.studentId),
      }),
  });
};
