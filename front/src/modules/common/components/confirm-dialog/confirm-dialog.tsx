"use client";

import { type MouseEvent, type SyntheticEvent, useId } from "react";
import { useModalDialog } from "../../hooks";
import { Button } from "../button/button";
import { confirmDialogStyles } from "./style";
import type { ConfirmDialogProps } from "./types";

export const ConfirmDialog = ({
  cancelLabel,
  confirmLabel,
  confirmVariant,
  description,
  isOpen,
  isPending,
  onCancel,
  onConfirm,
  title,
}: ConfirmDialogProps) => {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useModalDialog(isOpen);

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();

    if (!isPending) {
      onCancel();
    }
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget && !isPending) {
      onCancel();
    }
  };

  return (
    <dialog
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      className={confirmDialogStyles.root}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      ref={dialogRef}
    >
      <div className={confirmDialogStyles.content}>
        <div className={confirmDialogStyles.text}>
          <h2 className={confirmDialogStyles.title} id={titleId}>
            {title}
          </h2>
          <p className={confirmDialogStyles.description} id={descriptionId}>
            {description}
          </p>
        </div>
        <div className={confirmDialogStyles.actions}>
          <Button disabled={isPending} onClick={onCancel} variant="ghost">
            {cancelLabel}
          </Button>
          <Button
            autoFocus
            disabled={isPending}
            onClick={onConfirm}
            variant={confirmVariant}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
};
