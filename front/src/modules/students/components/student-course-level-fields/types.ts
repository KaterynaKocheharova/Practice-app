import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { CreateStudentCourseFormInput } from "../create-student-course-form/schema";

export interface StudentCourseLevelFieldsProps {
  errors: FieldErrors<CreateStudentCourseFormInput>;
  register: UseFormRegister<CreateStudentCourseFormInput>;
}
