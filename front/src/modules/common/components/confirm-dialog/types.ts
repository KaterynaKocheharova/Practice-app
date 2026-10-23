import type { ButtonVariant } from "../button/types";

export interface ConfirmDialogProps {
  cancelLabel: string;
  confirmLabel: string;
  confirmVariant: ButtonVariant;
  description: string;
  isOpen: boolean;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
}
