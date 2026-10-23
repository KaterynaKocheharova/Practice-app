"use client";

import { Flag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/modules/common/components";
import { ERRORS, TEXTS } from "@/modules/common/constants";
import { useServerActionToast } from "@/modules/common/hooks";
import { completeTeacherGoalAction } from "../../actions/teacher-goals-actions";
import { getTeacherGoalErrorMessage } from "../../utils";
import { completeTeacherGoalButtonStyles } from "./style";
import type { CompleteTeacherGoalButtonProps } from "./types";

const { GOALS } = TEXTS;

export const CompleteTeacherGoalButton = ({
  goalId,
  title,
}: CompleteTeacherGoalButtonProps) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const { isPending, run: completeGoal } = useServerActionToast(
    completeTeacherGoalAction,
    {
      getErrorMessage: (errorCode) =>
        getTeacherGoalErrorMessage(
          errorCode,
          ERRORS.TEACHER_GOALS.COMPLETE_FAILED,
        ),
      successMessage: GOALS.GOAL_COMPLETED,
    },
  );

  const handleConfirm = async () => {
    if (!(await completeGoal(goalId))) {
      setIsConfirming(false);
    }
  };

  if (!isConfirming) {
    return (
      <Button
        aria-label={GOALS.COMPLETE_LABEL(title)}
        onClick={() => setIsConfirming(true)}
        size="sm"
        variant="ghost"
      >
        <Flag aria-hidden className={completeTeacherGoalButtonStyles.icon} />
        {GOALS.COMPLETE}
      </Button>
    );
  }

  return (
    <div className={completeTeacherGoalButtonStyles.confirm} role="group">
      <p className={completeTeacherGoalButtonStyles.warning}>
        {GOALS.COMPLETE_WARNING}
      </p>
      <Button
        disabled={isPending}
        onClick={() => setIsConfirming(false)}
        size="sm"
        variant="ghost"
      >
        {GOALS.CANCEL}
      </Button>
      <Button
        aria-label={GOALS.COMPLETE_LABEL(title)}
        autoFocus
        disabled={isPending}
        onClick={() => void handleConfirm()}
        size="sm"
        variant="primary"
      >
        {isPending ? GOALS.COMPLETING : GOALS.CONFIRM_COMPLETE}
      </Button>
    </div>
  );
};
