import { ConfigService } from '@nestjs/config';
import type { ZodType } from 'zod';

import type {
  AuthEnvConfig,
  DatabaseEnvConfig,
  RedisEnvConfig,
  ResendEnvConfig,
  S3EnvConfig,
  SmtpEnvConfig,
  StorageEnvConfig,
} from '../types/env';
import {
  authEnvConfigSchema,
  databaseEnvConfigSchema,
  redisEnvConfigSchema,
  resendEnvConfigSchema,
  s3EnvConfigSchema,
  smtpEnvConfigSchema,
  storageEnvConfigSchema,
} from './env-config.schema';
import { ENV_NAMES } from './env-names';

export const getStorageEnvConfig = (
  configService: ConfigService,
): StorageEnvConfig =>
  parseEnvConfig(storageEnvConfigSchema, {
    driver: configService.get<string>(ENV_NAMES.STORAGE_DRIVER),
  });

export const getS3EnvConfig = (configService: ConfigService): S3EnvConfig =>
  parseEnvConfig(s3EnvConfigSchema, {
    bucket: configService.get<string>(ENV_NAMES.S3_BUCKET),
    region: configService.get<string>(ENV_NAMES.S3_REGION),
    accessKeyId: configService.get<string>(ENV_NAMES.S3_ACCESS_KEY_ID),
    secretAccessKey: configService.get<string>(ENV_NAMES.S3_SECRET_ACCESS_KEY),
    endpoint: configService.get<string>(ENV_NAMES.S3_ENDPOINT) || undefined,
    forcePathStyle:
      configService.get<string>(ENV_NAMES.S3_FORCE_PATH_STYLE) || undefined,
  });

export const getDatabaseEnvConfig = (
  configService: ConfigService,
): DatabaseEnvConfig =>
  parseEnvConfig(databaseEnvConfigSchema, {
    url: configService.get<string>(ENV_NAMES.DATABASE_URL),
  });

export const getSmtpEnvConfig = (configService: ConfigService): SmtpEnvConfig =>
  parseEnvConfig(smtpEnvConfigSchema, {
    host: configService.get<string>(ENV_NAMES.SMTP_HOST),
    port: configService.get<string>(ENV_NAMES.SMTP_PORT),
    user: configService.get<string>(ENV_NAMES.SMTP_USER),
    pass: configService.get<string>(ENV_NAMES.SMTP_PASS),
    from: configService.get<string>(ENV_NAMES.SMTP_FROM),
  });

export const getResendEnvConfig = (
  configService: ConfigService,
): ResendEnvConfig =>
  parseEnvConfig(resendEnvConfigSchema, {
    apiKey: configService.get<string>(ENV_NAMES.RESEND_API_KEY),
    from: configService.get<string>(ENV_NAMES.RESEND_FROM),
  });

export const getRedisEnvConfig = (
  configService: ConfigService,
): RedisEnvConfig =>
  parseEnvConfig(redisEnvConfigSchema, {
    host: configService.get<string>(ENV_NAMES.REDIS_HOST),
    port: configService.get<string>(ENV_NAMES.REDIS_PORT),
    password: configService.get<string>(ENV_NAMES.REDIS_PASSWORD) || undefined,
    db: configService.get<string>(ENV_NAMES.REDIS_DB),
  });

export const getAuthEnvConfig = (configService: ConfigService): AuthEnvConfig =>
  parseEnvConfig(authEnvConfigSchema, {
    signupVerificationSecret: configService.get<string>(
      ENV_NAMES.JWT_SIGNUP_VERIFICATION_SECRET,
    ),
    signupVerificationExpiresIn: configService.get<string>(
      ENV_NAMES.JWT_SIGNUP_VERIFICATION_EXPIRES_IN,
    ),
    signinVerificationExpiresIn: configService.get<string>(
      ENV_NAMES.JWT_SIGNIN_VERIFICATION_EXPIRES_IN,
    ),
    accessSecret: configService.get<string>(ENV_NAMES.JWT_ACCESS_SECRET),
    accessExpiresIn: configService.get<string>(ENV_NAMES.JWT_ACCESS_EXPIRES_IN),
    refreshSecret: configService.get<string>(ENV_NAMES.JWT_REFRESH_SECRET),
    refreshExpiresIn: configService.get<string>(
      ENV_NAMES.JWT_REFRESH_EXPIRES_IN,
    ),
    frontendUrl: configService.get<string>(ENV_NAMES.FRONTEND_URL),
    googleOAuthClientId: configService.get<string>(
      ENV_NAMES.GOOGLE_OAUTH_CLIENT_ID,
    ),
    googleOAuthClientSecret: configService.get<string>(
      ENV_NAMES.GOOGLE_OAUTH_CLIENT_SECRET,
    ),
    googleOAuthRedirectUri: configService.get<string>(
      ENV_NAMES.GOOGLE_OAUTH_REDIRECT_URI,
    ),
    googleOAuthStateSecret: configService.get<string>(
      ENV_NAMES.GOOGLE_OAUTH_STATE_SECRET,
    ),
  });

export const isProductionEnv = (configService: ConfigService): boolean =>
  configService.get<string>(ENV_NAMES.NODE_ENV) === 'production';

const parseEnvConfig = <TConfig>(
  schema: ZodType<TConfig>,
  config: unknown,
): TConfig => {
  const result = schema.safeParse(config);

  if (result.success) {
    return result.data;
  }

  const message = result.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join(', ');

  throw new Error(`Invalid environment configuration: ${message}`);
};
