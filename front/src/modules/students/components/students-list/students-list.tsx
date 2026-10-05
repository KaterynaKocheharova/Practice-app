"use client";

import { toast } from "sonner";
import { ERRORS, TEXTS } from "@/modules/common/constants";
import { useStudents } from "../../hooks";
import { STUDENTS_CONFIG } from "../../students.config";
import { StudentCard } from "../student-card/student-card";
import { StudentsListEmpty } from "../students-list-empty/students-list-empty";
import { StudentsListError } from "../students-list-error/students-list-error";
import { StudentsListSkeleton } from "../students-list-skeleton/students-list-skeleton";
import { StudentsLoadMore } from "../students-load-more/students-load-more";
import { studentsListStyles } from "./style";

export const StudentsList = () => {
  const {
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isPending,
    refetch,
    students,
  } = useStudents();

  const handleLoadMore = async () => {
    const { isFetchNextPageError } = await fetchNextPage();

    if (isFetchNextPageError) {
      toast.error(ERRORS.STUDENTS.LOAD_FAILED);
    }
  };

  if (isPending) {
    return <StudentsListSkeleton count={STUDENTS_CONFIG.pagination.pageSize} />;
  }

  if (isError && students.length === 0) {
    return <StudentsListError onRetry={() => void refetch()} />;
  }

  if (students.length === 0) {
    return <StudentsListEmpty />;
  }

  return (
    <div className={studentsListStyles.root}>
      <ul
        aria-label={TEXTS.STUDENTS.LIST_LABEL}
        className={studentsListStyles.grid}
      >
        {students.map((student) => (
          <li key={student.id}>
            <StudentCard student={student} />
          </li>
        ))}
      </ul>

      {hasNextPage && (
        <StudentsLoadMore
          isLoading={isFetchingNextPage}
          onLoadMore={() => void handleLoadMore()}
        />
      )}
    </div>
  );
};
