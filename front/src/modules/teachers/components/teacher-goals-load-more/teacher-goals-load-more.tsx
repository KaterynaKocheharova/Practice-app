import { Button } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { teacherGoalsLoadMoreStyles } from "./style";
import type { TeacherGoalsLoadMoreProps } from "./types";

export const TeacherGoalsLoadMore = ({
  isLoading,
  onLoadMore,
}: TeacherGoalsLoadMoreProps) => (
  <div className={teacherGoalsLoadMoreStyles.root}>
    <Button disabled={isLoading} onClick={onLoadMore} variant="secondary">
      {isLoading ? TEXTS.GOALS.LOADING_MORE : TEXTS.GOALS.LOAD_MORE}
    </Button>
  </div>
);
