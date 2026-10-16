import { UserRole } from "@/modules/auth/auth.enums";
import { TEXTS } from "@/modules/common/constants";
import {
  OnboardingFormField,
  OnboardingFormFieldId,
  OnboardingInputType,
} from "./onboarding.enums";

export const ONBOARDING_CONFIG = {
  form: {
    fieldIds: OnboardingFormFieldId,
    fields: OnboardingFormField,
    inputTypes: {
      name: OnboardingInputType.Text,
    },
  },
  roleOptions: [
    { label: TEXTS.ONBOARDING.ROLE_TEACHER, value: UserRole.Teacher },
    { label: TEXTS.ONBOARDING.ROLE_STUDENT, value: UserRole.Student },
  ],
} as const;
