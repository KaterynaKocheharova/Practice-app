import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { StudentFormValues } from "../../schemas";

export interface StudentFormFieldsProps {
  errors: FieldErrors<StudentFormValues>;
  /** Hidden once the email belongs to the student's own account. */
  isEmailEditable: boolean;
  register: UseFormRegister<StudentFormValues>;
}
