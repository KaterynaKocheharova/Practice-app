"use client";

import { toast } from "sonner";
import { ERRORS } from "@/modules/common/constants";
import { useTeacherGoalsPages } from "../../hooks";
import { TeacherGoalCardsList } from "../teacher-goal-cards-list/teacher-goal-cards-list";
import { TeacherGoalsListEmpty } from "../teacher-goals-list-empty/teacher-goals-list-empty";
import { TeacherGoalsLoadMore } from "../teacher-goals-load-more/teacher-goals-load-more";
import { teacherGoalsListStyles } from "./style";
import type { TeacherGoalsListProps } from "./types";

export const TeacherGoalsList = ({
  firstPage,
  status,
}: TeacherGoalsListProps) => {
  const { goals, hasNextPage, isLoadingMore, loadMore } = useTeacherGoalsPages(
    firstPage,
    status,
  );

  const handleLoadMore = async () => {
    if (!(await loadMore())) {
      toast.error(ERRORS.TEACHER_GOALS.LOAD_FAILED);
    }
  };

  if (goals.length === 0) {
    return <TeacherGoalsListEmpty status={status} />;
  }

  return (
    <div className={teacherGoalsListStyles.root}>
      <TeacherGoalCardsList goals={goals} />
      {hasNextPage && (
        <TeacherGoalsLoadMore
          isLoading={isLoadingMore}
          onLoadMore={() => void handleLoadMore()}
        />
      )}
    </div>
  );
};
