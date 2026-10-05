import type { InputProps } from "../input/types";

export interface TextFieldProps extends Omit<InputProps, "id"> {
  errorId: string;
  errorMessage?: string;
  hint?: string;
  hintId?: string;
  id: string;
  label: string;
  optionalLabel?: string;
}
