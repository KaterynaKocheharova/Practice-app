"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/modules/common/components";
import { ERRORS, TEXTS } from "@/modules/common/constants";
import { useServerActionToast } from "@/modules/common/hooks";
import { deleteTeacherGoalAction } from "../../actions/teacher-goals-actions";
import { getTeacherGoalErrorMessage } from "../../utils";
import { deleteTeacherGoalButtonStyles } from "./style";
import type { DeleteTeacherGoalButtonProps } from "./types";

const { GOALS } = TEXTS;

export const DeleteTeacherGoalButton = ({
  goalId,
  title,
}: DeleteTeacherGoalButtonProps) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const { isPending, run: deleteGoal } = useServerActionToast(
    deleteTeacherGoalAction,
    {
      getErrorMessage: (errorCode) =>
        getTeacherGoalErrorMessage(
          errorCode,
          ERRORS.TEACHER_GOALS.DELETE_FAILED,
        ),
      successMessage: GOALS.DELETED,
    },
  );

  const handleConfirm = async () => {
    if (!(await deleteGoal(goalId))) {
      setIsConfirming(false);
    }
  };

  if (!isConfirming) {
    return (
      <Button
        aria-label={GOALS.DELETE_LABEL(title)}
        onClick={() => setIsConfirming(true)}
        size="sm"
        variant="ghost"
      >
        <Trash2 aria-hidden className={deleteTeacherGoalButtonStyles.icon} />
        {GOALS.DELETE}
      </Button>
    );
  }

  return (
    <div className={deleteTeacherGoalButtonStyles.confirm} role="group">
      <p className={deleteTeacherGoalButtonStyles.warning}>
        {GOALS.DELETE_WARNING}
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
        aria-label={GOALS.DELETE_LABEL(title)}
        autoFocus
        disabled={isPending}
        onClick={() => void handleConfirm()}
        size="sm"
        variant="danger"
      >
        {isPending ? GOALS.DELETING : GOALS.CONFIRM_DELETE}
      </Button>
    </div>
  );
};
