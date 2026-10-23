"use client";

import { useState } from "react";
import { useServerAction } from "@/modules/common/hooks";
import { loadTeacherGoalsPageAction } from "../actions/teacher-goals-actions";
import type { TeacherGoalStatus } from "../teachers.enums";
import type { TeacherGoalsPage } from "../types";
import { appendNewGoals } from "../utils";

export const useTeacherGoalsPages = (
  firstPage: TeacherGoalsPage,
  status: TeacherGoalStatus,
) => {
  const [goals, setGoals] = useState(firstPage.items);
  const [total, setTotal] = useState(firstPage.total);
  const [hasMorePages, setHasMorePages] = useState(true);
  const { isPending, run: loadPage } = useServerAction(
    loadTeacherGoalsPageAction,
  );

  const hasNextPage = hasMorePages && goals.length < total;

  const loadMore = async (): Promise<boolean> => {
    const result = await loadPage(goals.length, status);

    if (!result.ok) {
      return false;
    }

    setGoals((loadedGoals) => appendNewGoals(loadedGoals, result.data.items));
    setTotal(result.data.total);
    setHasMorePages(result.data.items.length > 0);

    return true;
  };

  return { goals, hasNextPage, isLoadingMore: isPending, loadMore };
};
