import type { UseFormRegisterReturn } from "react-hook-form";

export interface SignUpRoleFieldProps {
  errorId?: string;
  errorMessage?: string;
  inputProps: UseFormRegisterReturn;
}
