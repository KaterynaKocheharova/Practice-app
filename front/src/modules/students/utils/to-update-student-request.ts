import type { StudentFormValues } from "../schemas";
import type { UpdateStudentRequest } from "../types";
import { parseHobbies } from "./parse-hobbies";

/**
 * The student editing themselves: every field except the email, which
 * belongs to their account. Emptied fields are sent as `null` to clear them.
 */
export const toUpdateStudentProfileRequest = ({
  birthDate,
  hobbies,
  job,
  name,
}: StudentFormValues): UpdateStudentRequest => {
  const hobbyList = parseHobbies(hobbies);

  return {
    birthDate: birthDate || null,
    hobbies: hobbyList.length > 0 ? hobbyList : null,
    job: job || null,
    name,
  };
};

/** The creating teacher editing a managed student, email included. */
export const toUpdateManagedStudentRequest = (
  values: StudentFormValues,
): UpdateStudentRequest => ({
  ...toUpdateStudentProfileRequest(values),
  email: values.email || null,
});
