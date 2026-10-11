"use client";

import { useState } from "react";
import { useServerAction } from "@/modules/common/hooks";
import { loadStudentsPageAction } from "../actions/students-actions";
import type { StudentsPage } from "../types";

/**
 * Starts from the server-rendered first page and appends pages on demand.
 * Resolves `loadMore` to whether the next page arrived.
 */
export const useStudentsPages = (firstPage: StudentsPage) => {
  const [pages, setPages] = useState([firstPage]);
  const { isPending, run: loadPage } = useServerAction(loadStudentsPageAction);

  const students = pages.flatMap((page) => page.items);
  const lastPage = pages[pages.length - 1];
  const hasNextPage =
    students.length < lastPage.total && lastPage.items.length > 0;

  const loadMore = async (): Promise<boolean> => {
    const result = await loadPage(students.length);

    if (!result.ok) {
      return false;
    }

    setPages((loadedPages) => [...loadedPages, result.data]);

    return true;
  };

  return { hasNextPage, isLoadingMore: isPending, loadMore, students };
};
