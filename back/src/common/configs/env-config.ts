import { ConfigService } from '@nestjs/config';
import type { ZodType } from 'zod';

import type {
  AuthEnvConfig,
  DatabaseEnvConfig,
  RedisEnvConfig,
  ResendEnvConfig,
  SmtpEnvConfig,
} from '../types/env';
import {
  authEnvConfigSchema,
  databaseEnvConfigSchema,
  redisEnvConfigSchema,
  resendEnvConfigSchema,
  smtpEnvConfigSchema,
} from './env-config.schema';
import { ENV_NAMES } from './env-names';

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
    frontendUrl: configService.get<string>(ENV_NAMES.FRONTEND_URL),
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
