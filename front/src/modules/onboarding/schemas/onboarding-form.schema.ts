import { z } from "zod";
import { UserRole } from "@/modules/auth/auth.enums";
import { ERRORS } from "@/modules/common/constants";
import {
  STUDENT_PROFILE_FORM_DEFAULT_VALUES,
  studentNameSchema,
  studentProfileFormSchema,
} from "@/modules/students/schemas";

export const onboardingFormSchema = studentProfileFormSchema.extend({
  name: studentNameSchema,
  role: z.enum(UserRole, ERRORS.VALIDATION.ROLE_REQUIRED),
});

export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;

export const toOnboardingFormDefaultValues = (
  name: string,
): Partial<OnboardingFormValues> => ({
  ...STUDENT_PROFILE_FORM_DEFAULT_VALUES,
  name,
});
