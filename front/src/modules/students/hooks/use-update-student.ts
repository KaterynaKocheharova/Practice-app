"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStudent } from "../api";
import { STUDENTS_CONFIG } from "../students.config";
import type { UpdateStudentRequest } from "../types";

/** Refreshes every student query: the details and the list cards change. */
export const useUpdateStudent = (studentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateStudentRequest) => updateStudent(studentId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: STUDENTS_CONFIG.queryKeys.all,
      }),
  });
};
