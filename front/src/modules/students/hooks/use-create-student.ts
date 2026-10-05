"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStudent } from "../api";
import { STUDENTS_CONFIG } from "../students.config";

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStudent,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: STUDENTS_CONFIG.queryKeys.all,
      }),
  });
};
