import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isProductionEnv } from 'src/common/configs/env-config';
import { MAIL_PROVIDER } from './constants';
import { ResendMailProvider, SmtpMailProvider } from './providers';
import type { IMailProvider } from './types';

@Module({
  providers: [
    ResendMailProvider,
    SmtpMailProvider,
    {
      provide: MAIL_PROVIDER,
      useFactory: (
        configService: ConfigService,
        resendMailProvider: ResendMailProvider,
        smtpMailProvider: SmtpMailProvider,
      ): IMailProvider =>
        isProductionEnv(configService) ? resendMailProvider : smtpMailProvider,
      inject: [ConfigService, ResendMailProvider, SmtpMailProvider],
    },
  ],
  exports: [MAIL_PROVIDER],
})
export class MailModule {}
