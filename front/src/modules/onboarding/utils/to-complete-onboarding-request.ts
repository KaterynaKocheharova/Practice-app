import { UserRole } from "@/modules/auth/auth.enums";
import { toStudentProfileRequest } from "@/modules/students/utils";
import type { OnboardingFormValues } from "../schemas";
import type { CompleteOnboardingRequest } from "../types";

export const toCompleteOnboardingRequest = ({
  name,
  role,
  ...profile
}: OnboardingFormValues): CompleteOnboardingRequest =>
  role === UserRole.Student
    ? { name, role, student: toStudentProfileRequest(profile) }
    : { name, role };
