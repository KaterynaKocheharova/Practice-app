import { z } from "zod";
import {
  authEmailSchema,
  authNameSchema,
  authNewPasswordSchema,
} from "@/modules/auth/schemas";
import { UserRole } from "@/modules/auth/types";

export const signUpSchema = z.object({
  email: authEmailSchema,
  name: authNameSchema,
  password: authNewPasswordSchema,
  role: z.literal(UserRole.Teacher),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;
