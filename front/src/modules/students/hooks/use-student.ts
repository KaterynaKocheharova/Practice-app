"use client";

import { useQuery } from "@tanstack/react-query";
import { getStudent } from "../api";
import { STUDENTS_CONFIG } from "../students.config";

export const useStudent = (studentId: string) =>
  useQuery({
    queryKey: STUDENTS_CONFIG.queryKeys.detail(studentId),
    queryFn: () => getStudent(studentId),
  });
