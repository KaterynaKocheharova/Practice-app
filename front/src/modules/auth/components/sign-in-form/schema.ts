import { z } from "zod";
import { authEmailSchema, authPasswordSchema } from "@/modules/auth/schemas";

export const signInSchema = z.object({
  email: authEmailSchema,
  password: authPasswordSchema,
});

export type SignInFormValues = z.infer<typeof signInSchema>;
