import type { UserRole } from "@/modules/auth/auth.enums";
import type { StudentDetails } from "../../types";

export interface EditStudentFormProps {
  returnHref: string;
  student: StudentDetails;
  viewerRole: UserRole;
}
