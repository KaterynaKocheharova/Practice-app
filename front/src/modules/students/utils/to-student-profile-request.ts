import type { StudentProfileFormValues } from "../schemas";
import type { StudentProfileRequest } from "../types";
import { parseHobbies } from "./parse-hobbies";

export const toStudentProfileRequest = ({
  birthDate,
  hobbies,
  job,
}: StudentProfileFormValues): StudentProfileRequest => {
  const hobbyList = parseHobbies(hobbies);

  return {
    ...(birthDate && { birthDate }),
    ...(job && { job }),
    ...(hobbyList.length > 0 && { hobbies: hobbyList }),
  };
};
