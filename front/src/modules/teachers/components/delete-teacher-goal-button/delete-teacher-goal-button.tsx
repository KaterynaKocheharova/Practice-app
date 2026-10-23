"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button, ConfirmDialog } from "@/modules/common/components";
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
    await deleteGoal(goalId);
    setIsConfirming(false);
  };

  return (
    <>
      <Button
        aria-label={GOALS.DELETE_LABEL(title)}
        onClick={() => setIsConfirming(true)}
        size="sm"
        variant="ghost"
      >
        <Trash2 aria-hidden className={deleteTeacherGoalButtonStyles.icon} />
        {GOALS.DELETE}
      </Button>
      <ConfirmDialog
        cancelLabel={GOALS.CANCEL}
        confirmLabel={isPending ? GOALS.DELETING : GOALS.DELETE}
        confirmVariant="danger"
        description={GOALS.DELETE_DESCRIPTION(title)}
        isOpen={isConfirming}
        isPending={isPending}
        onCancel={() => setIsConfirming(false)}
        onConfirm={() => void handleConfirm()}
        title={GOALS.DELETE_TITLE}
      />
    </>
  );
};
