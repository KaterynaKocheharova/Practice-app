"use client";

import { Flag } from "lucide-react";
import { useState } from "react";
import { Button, ConfirmDialog } from "@/modules/common/components";
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
    await completeGoal(goalId);
    setIsConfirming(false);
  };

  return (
    <>
      <Button
        aria-label={GOALS.COMPLETE_LABEL(title)}
        onClick={() => setIsConfirming(true)}
        size="sm"
        variant="ghost"
      >
        <Flag aria-hidden className={completeTeacherGoalButtonStyles.icon} />
        {GOALS.COMPLETE}
      </Button>
      <ConfirmDialog
        cancelLabel={GOALS.CANCEL}
        confirmLabel={isPending ? GOALS.COMPLETING : GOALS.COMPLETE}
        confirmVariant="primary"
        description={GOALS.COMPLETE_DESCRIPTION(title)}
        isOpen={isConfirming}
        isPending={isPending}
        onCancel={() => setIsConfirming(false)}
        onConfirm={() => void handleConfirm()}
        title={GOALS.COMPLETE_TITLE}
      />
    </>
  );
};
