import type { StudentFormValues } from "../schemas";
import type { CreateStudentRequest } from "../types";
import { toStudentProfileRequest } from "./to-student-profile-request";

export const toCreateStudentRequest = ({
  name,
  ...profile
}: StudentFormValues): CreateStudentRequest => ({
  name,
  ...toStudentProfileRequest(profile),
});
