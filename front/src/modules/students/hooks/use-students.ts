"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getStudents } from "../api";
import { STUDENTS_CONFIG } from "../students.config";
import type { StudentsPage } from "../types";

const { pageSize } = STUDENTS_CONFIG.pagination;

const getNextOffset = (
  lastPage: StudentsPage,
  allPages: StudentsPage[],
): number | undefined => {
  const loadedCount = allPages.reduce(
    (count, page) => count + page.items.length,
    0,
  );

  return loadedCount < lastPage.total && lastPage.items.length > 0
    ? loadedCount
    : undefined;
};

export const useStudents = () => {
  const query = useInfiniteQuery({
    queryKey: STUDENTS_CONFIG.queryKeys.list(pageSize),
    queryFn: ({ pageParam }) =>
      getStudents({ limit: pageSize, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: getNextOffset,
  });

  return {
    ...query,
    students: query.data?.pages.flatMap((page) => page.items) ?? [],
  };
};
