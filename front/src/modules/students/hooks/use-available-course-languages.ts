"use client";

import { useQuery } from "@tanstack/react-query";
import { getAvailableCourseLanguages } from "../api";
import { STUDENTS_CONFIG } from "../students.config";

/** Languages the teacher can still open a course in with the student. */
export const useAvailableCourseLanguages = (studentId: string) =>
  useQuery({
    queryKey: STUDENTS_CONFIG.queryKeys.availableLanguages(studentId),
    queryFn: () => getAvailableCourseLanguages(studentId),
  });
