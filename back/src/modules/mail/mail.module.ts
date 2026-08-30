import { Module } from '@nestjs/common';
import { MAIL_PROVIDER } from './constants';
import { SmtpMailProvider } from './providers';

@Module({
  providers: [
    {
      provide: MAIL_PROVIDER,
      useClass: SmtpMailProvider,
    },
  ],
  exports: [MAIL_PROVIDER],
})
export class MailModule {}
