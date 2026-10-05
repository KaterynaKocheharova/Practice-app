import { Button } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { studentsLoadMoreStyles } from "./style";
import type { StudentsLoadMoreProps } from "./types";

export const StudentsLoadMore = ({
  isLoading,
  onLoadMore,
}: StudentsLoadMoreProps) => (
  <div className={studentsLoadMoreStyles.root}>
    <Button disabled={isLoading} onClick={onLoadMore} variant="secondary">
      {isLoading ? TEXTS.STUDENTS.LOADING_MORE : TEXTS.STUDENTS.LOAD_MORE}
    </Button>
  </div>
);
