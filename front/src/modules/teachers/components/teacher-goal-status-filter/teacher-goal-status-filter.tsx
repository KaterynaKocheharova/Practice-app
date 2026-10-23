"use client";

import { SelectField } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { toSelectOptions } from "@/modules/common/utils";
import { useTeacherGoalStatusFilter } from "../../hooks";
import { TEACHERS_CONFIG } from "../../teachers.config";
import { parseTeacherGoalStatus } from "../../utils";
import { teacherGoalStatusFilterStyles } from "./style";
import type { TeacherGoalStatusFilterProps } from "./types";

const STATUS_OPTIONS = toSelectOptions(TEACHERS_CONFIG.goalLabels.statuses);

export const TeacherGoalStatusFilter = ({
  status,
}: TeacherGoalStatusFilterProps) => {
  const { isPending, selectStatus } = useTeacherGoalStatusFilter();

  return (
    <div
      aria-busy={isPending}
      className={teacherGoalStatusFilterStyles.root(isPending)}
    >
      <SelectField
        id={TEACHERS_CONFIG.filters.statusId}
        label={TEXTS.GOALS.FILTER_STATUS}
        onChange={(event) =>
          selectStatus(parseTeacherGoalStatus(event.target.value))
        }
        options={STATUS_OPTIONS}
        value={status}
      />
    </div>
  );
};
