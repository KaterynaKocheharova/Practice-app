import { z } from "zod";
import { ERRORS } from "@/modules/common/constants";

export const authEmailSchema = z.email(ERRORS.VALIDATION.EMAIL_INVALID).trim();

export const authNameSchema = z
  .string()
  .min(2, ERRORS.VALIDATION.NAME_MIN_LENGTH)
  .trim();

export const authPasswordSchema = z
  .string()
  .min(1, ERRORS.VALIDATION.PASSWORD_REQUIRED);

export const authNewPasswordSchema = authPasswordSchema
  .min(8, ERRORS.VALIDATION.PASSWORD_MIN_LENGTH)
  .regex(/[a-zA-Z]/, ERRORS.VALIDATION.PASSWORD_REQUIRES_LETTER)
  .regex(/[0-9]/, ERRORS.VALIDATION.PASSWORD_REQUIRES_NUMBER)
  .regex(/[^a-zA-Z0-9]/, ERRORS.VALIDATION.PASSWORD_REQUIRES_SPECIAL);
