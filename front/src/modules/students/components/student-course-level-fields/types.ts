import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { StudentCourseFormInput } from "../../schemas";

export interface StudentCourseLevelFieldsProps {
  errors: FieldErrors<StudentCourseFormInput>;
  register: UseFormRegister<StudentCourseFormInput>;
}
