import { z } from 'zod';

export const databaseEnvConfigSchema = z.object({
  url: z.string().min(1),
});

export const smtpEnvConfigSchema = z.object({
  host: z.string().min(1),
  port: z.coerce.number().int().min(1).max(65535),
  user: z.string().min(1),
  pass: z.string().min(1),
  from: z.string().min(1),
});

export const resendEnvConfigSchema = z.object({
  apiKey: z.string().min(1),
  from: z.string().min(1),
});

export const redisEnvConfigSchema = z.object({
  host: z.string().min(1),
  port: z.coerce.number().int().min(1).max(65535),
  password: z.string().min(1).optional(),
  db: z.coerce.number().int().min(0).default(0),
});

export const authEnvConfigSchema = z.object({
  signupVerificationSecret: z.string().min(32),
  frontendUrl: z.url(),
});
