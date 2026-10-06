import type { TextareaProps } from "../textarea/types";

export interface TextareaFieldProps extends Omit<TextareaProps, "id"> {
  errorId: string;
  errorMessage?: string;
  id: string;
  label: string;
  optionalLabel?: string;
}
