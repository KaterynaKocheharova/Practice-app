"use client";

import { toast } from "sonner";
import { ERRORS, TEXTS } from "@/modules/common/constants";
import { useStudentsPages } from "../../hooks";
import { StudentCard } from "../student-card/student-card";
import { StudentsListEmpty } from "../students-list-empty/students-list-empty";
import { StudentsLoadMore } from "../students-load-more/students-load-more";
import { studentsListStyles } from "./style";
import type { StudentsListProps } from "./types";

export const StudentsList = ({ firstPage }: StudentsListProps) => {
  const { hasNextPage, isLoadingMore, loadMore, students } =
    useStudentsPages(firstPage);

  const handleLoadMore = async () => {
    if (!(await loadMore())) {
      toast.error(ERRORS.STUDENTS.LOAD_FAILED);
    }
  };

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
          isLoading={isLoadingMore}
          onLoadMore={() => void handleLoadMore()}
        />
      )}
    </div>
  );
};
