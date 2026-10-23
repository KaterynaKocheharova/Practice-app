"use client";

import { useId } from "react";
import { Button } from "@/modules/common/components";
import { ERRORS, TEXTS } from "@/modules/common/constants";
import { useServerActionToast } from "@/modules/common/hooks";
import { createTeacherGoalProgressCheckAction } from "../../actions/teacher-goals-actions";
import { TEACHERS_CONFIG } from "../../teachers.config";
import type { GoalProgressStatus } from "../../teachers.enums";
import { getTeacherGoalErrorMessage } from "../../utils";
import { teacherGoalProgressCheckStyles } from "./style";
import type { TeacherGoalProgressCheckProps } from "./types";

const PROGRESS_OPTIONS = Object.entries(
  TEACHERS_CONFIG.goalLabels.progressStatuses,
) as [GoalProgressStatus, string][];

export const TeacherGoalProgressCheck = ({
  goalId,
}: TeacherGoalProgressCheckProps) => {
  const questionId = useId();
  const { isPending, run: createProgressCheck } = useServerActionToast(
    createTeacherGoalProgressCheckAction,
    {
      getErrorMessage: (errorCode) =>
        getTeacherGoalErrorMessage(
          errorCode,
          ERRORS.TEACHER_GOALS.PROGRESS_CHECK_FAILED,
        ),
      successMessage: TEXTS.GOALS.PROGRESS_SAVED,
    },
  );

  return (
    <div
      aria-busy={isPending}
      aria-labelledby={questionId}
      className={teacherGoalProgressCheckStyles.root}
      role="group"
    >
      <p className={teacherGoalProgressCheckStyles.question} id={questionId}>
        {TEXTS.GOALS.PROGRESS_QUESTION}
      </p>
      <div className={teacherGoalProgressCheckStyles.options}>
        {PROGRESS_OPTIONS.map(([status, label]) => (
          <Button
            disabled={isPending}
            key={status}
            onClick={() => void createProgressCheck(goalId, { status })}
            size="sm"
            variant="secondary"
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};
