"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCourseDocument } from "../api";
import { STUDENTS_CONFIG } from "../students.config";
import type { GetCourseDocumentRequest } from "../types";

export const useDeleteCourseDocument = (document: GetCourseDocumentRequest) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteCourseDocument(document),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: STUDENTS_CONFIG.queryKeys.course(
          document.studentId,
          document.courseId,
        ),
      }),
  });
};
