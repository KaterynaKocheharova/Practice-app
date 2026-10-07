import type { ReactNode } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { StudentCourseFormInput } from "../../schemas";

export interface StudentCourseFormFieldsProps {
  errors: FieldErrors<StudentCourseFormInput>;
  languageField?: ReactNode;
  register: UseFormRegister<StudentCourseFormInput>;
}
