import type { UseFormRegisterReturn } from "react-hook-form";
import type { StudentProfileFormValues } from "../../schemas";

type StudentProfileField = keyof StudentProfileFormValues;

export interface StudentProfileFieldsProps {
  errorMessages: Partial<Record<StudentProfileField, string>>;
  inputProps: Record<StudentProfileField, UseFormRegisterReturn>;
}
