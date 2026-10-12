import type { StudentFormValues } from "../schemas";
import type { UpdateStudentRequest } from "../types";
import { parseHobbies } from "./parse-hobbies";

export const toUpdateStudentRequest = ({
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
