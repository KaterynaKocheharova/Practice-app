import { z } from "zod";
import {
  authEmailSchema,
  authNameSchema,
  authNewPasswordSchema,
} from "@/modules/auth/schemas";
import { UserRole } from "@/modules/auth/auth.enums";

export const signUpSchema = z.object({
  email: authEmailSchema,
  name: authNameSchema,
  password: authNewPasswordSchema,
  role: z.union([z.literal(UserRole.Teacher), z.literal(UserRole.Student)]),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;
