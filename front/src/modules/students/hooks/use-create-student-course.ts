"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStudentCourse } from "../api";
import { STUDENTS_CONFIG } from "../students.config";
import type { CreateStudentCourseRequest } from "../types";

export const useCreateStudentCourse = (studentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStudentCourseRequest) =>
      createStudentCourse(studentId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: STUDENTS_CONFIG.queryKeys.courses(studentId),
      }),
  });
};
