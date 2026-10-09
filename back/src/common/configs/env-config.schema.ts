import { z } from 'zod';

import { StorageDriver } from '../storage/enums';

export const storageEnvConfigSchema = z.object({
  driver: z.enum(StorageDriver),
});

export const s3EnvConfigSchema = z.object({
  bucket: z.string().min(1),
  region: z.string().min(1),
  accessKeyId: z.string().min(1),
  secretAccessKey: z.string().min(1),
  /** Only for S3-compatible services (MinIO, R2); unset for AWS. */
  endpoint: z.url().optional(),
  forcePathStyle: z.stringbool().default(false),
});

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
  signupVerificationExpiresIn: z.coerce.number().int().positive(),
  signinVerificationExpiresIn: z.coerce.number().int().positive(),
  accessSecret: z.string().min(32),
  accessExpiresIn: z.coerce.number().int().positive(),
  refreshSecret: z.string().min(32),
  refreshExpiresIn: z.coerce.number().int().positive(),
  frontendUrl: z.url(),
  googleOAuthClientId: z.string().min(1),
  googleOAuthClientSecret: z.string().min(1),
  googleOAuthRedirectUri: z.url(),
  googleOAuthStateSecret: z.string().min(32),
});
