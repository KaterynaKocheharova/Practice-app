"use client";

import { Check } from "lucide-react";
import { Button } from "@/modules/common/components";
import { ERRORS, TEXTS } from "@/modules/common/constants";
import { useServerActionToast } from "@/modules/common/hooks";
import { addTeacherGoalAttemptAction } from "../../actions/teacher-goals-actions";
import { getTeacherGoalErrorMessage } from "../../utils";
import { markTeacherGoalAttemptButtonStyles } from "./style";
import type { MarkTeacherGoalAttemptButtonProps } from "./types";

const { GOALS } = TEXTS;

export const MarkTeacherGoalAttemptButton = ({
  goalId,
  title,
}: MarkTeacherGoalAttemptButtonProps) => {
  const { isPending, run: markAttempt } = useServerActionToast(
    addTeacherGoalAttemptAction,
    {
      getErrorMessage: (errorCode) =>
        getTeacherGoalErrorMessage(
          errorCode,
          ERRORS.TEACHER_GOALS.ATTEMPT_FAILED,
        ),
      successMessage: GOALS.GOAL_MARKED,
    },
  );

  return (
    <Button
      aria-label={GOALS.MARK_ATTEMPT_LABEL(title)}
      disabled={isPending}
      onClick={() => void markAttempt(goalId)}
      size="sm"
      variant="secondary"
    >
      <Check aria-hidden className={markTeacherGoalAttemptButtonStyles.icon} />
      {isPending ? GOALS.MARKING_ATTEMPT : GOALS.MARK_ATTEMPT}
    </Button>
  );
};
