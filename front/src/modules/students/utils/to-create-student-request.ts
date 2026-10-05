import type { CreateStudentFormValues } from "../components/create-student-form/schema";
import type { CreateStudentRequest } from "../types";
import { parseHobbies } from "./parse-hobbies";

/** Omits empty optional fields: the backend rejects empty strings. */
export const toCreateStudentRequest = ({
  birthDate,
  email,
  hobbies,
  job,
  name,
}: CreateStudentFormValues): CreateStudentRequest => {
  const hobbyList = parseHobbies(hobbies);

  return {
    name,
    ...(email && { email }),
    ...(birthDate && { birthDate }),
    ...(job && { job }),
    ...(hobbyList.length > 0 && { hobbies: hobbyList }),
  };
};
