import { UserRole } from "@/modules/auth/types";
import { TEXTS } from "@/modules/common/constants";

export const signUpRoleFieldIds = {
  role: "role",
} as const;

export const signUpRoleOptions = [
  {
    label: TEXTS.AUTH.ROLE_TEACHER,
    value: UserRole.Teacher,
  },
  {
    label: TEXTS.AUTH.ROLE_STUDENT,
    value: UserRole.Student,
  },
] as const;
