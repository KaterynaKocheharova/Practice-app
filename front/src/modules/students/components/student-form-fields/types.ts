import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { StudentFormValues } from "../../schemas";

export interface StudentFormFieldsProps {
  errors: FieldErrors<StudentFormValues>;
  register: UseFormRegister<StudentFormValues>;
}
