import { UserStatus } from "@/modules/auth/auth.enums";
import type { StudentDetails } from "../types";

/**
 * A managed student has no account of their own, so their creating teacher
 * may edit them. Once they sign up, only the student edits their profile.
 */
export const isManagedStudent = ({ status }: Pick<StudentDetails, "status">) =>
  status === UserStatus.Managed;
