import type { InjectionToken } from '@nestjs/common';

export const mailConfig = {
  PROVIDER: Symbol('mail.provider') as InjectionToken,
  QUEUE: {
    NAME: 'mail',
  },
  JOBS: {
    SEND_EMAIL: 'send-email',
  },
} as const;
