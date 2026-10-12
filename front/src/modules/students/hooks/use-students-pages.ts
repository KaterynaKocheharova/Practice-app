"use client";

import { useState } from "react";
import { useServerAction } from "@/modules/common/hooks";
import { loadStudentsPageAction } from "../actions/students-actions";
import type { StudentsPage } from "../types";
import { appendNewStudents } from "../utils";

/**
 * Starts from the server-rendered first page and appends pages on demand.
 * Resolves `loadMore` to whether the next page arrived.
 */
export const useStudentsPages = (firstPage: StudentsPage) => {
  const [students, setStudents] = useState(firstPage.items);
  const [total, setTotal] = useState(firstPage.total);
  const [hasMorePages, setHasMorePages] = useState(true);
  const { isPending, run: loadPage } = useServerAction(loadStudentsPageAction);

  const hasNextPage = hasMorePages && students.length < total;

  const loadMore = async (): Promise<boolean> => {
    const result = await loadPage(students.length);

    if (!result.ok) {
      return false;
    }

    setStudents((loadedStudents) =>
      appendNewStudents(loadedStudents, result.data.items),
    );
    setTotal(result.data.total);
    setHasMorePages(result.data.items.length > 0);

    return true;
  };

  return { hasNextPage, isLoadingMore: isPending, loadMore, students };
};
