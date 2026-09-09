import type { InputProps } from "../input/types";

export interface PasswordFieldProps extends Omit<InputProps, "type"> {
  errorId?: string;
  errorMessage?: string;
  label: string;
}
