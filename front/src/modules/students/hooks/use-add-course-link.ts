"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourseLinkDocument } from "../api";
import { STUDENTS_CONFIG } from "../students.config";
import type {
  CreateCourseLinkDocumentRequest,
  GetStudentCourseRequest,
} from "../types";

export const useAddCourseLink = (course: GetStudentCourseRequest) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseLinkDocumentRequest) =>
      createCourseLinkDocument(course, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: STUDENTS_CONFIG.queryKeys.course(
          course.studentId,
          course.courseId,
        ),
      }),
  });
};
