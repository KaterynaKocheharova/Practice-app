import type { UserRole } from "@/modules/auth/auth.enums";
import type { StudentProfileRequest } from "@/modules/students/types";

export interface CompleteOnboardingRequest {
  name: string;
  role: UserRole;
  student?: StudentProfileRequest;
}
