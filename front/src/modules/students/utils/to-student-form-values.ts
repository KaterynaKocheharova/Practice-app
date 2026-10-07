import type { StudentFormValues } from "../schemas";
import { STUDENTS_CONFIG } from "../students.config";
import type { StudentDetails } from "../types";

/** Prefills the student form: inputs need strings, not `null`. */
export const toStudentFormValues = ({
  birthDate,
  email,
  hobbies,
  job,
  name,
}: StudentDetails): StudentFormValues => ({
  birthDate: birthDate ?? "",
  email: email ?? "",
  hobbies: (hobbies ?? []).join(`${STUDENTS_CONFIG.hobbiesSeparator} `),
  job: job ?? "",
  name,
});
