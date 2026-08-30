import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isProductionEnv } from 'src/common/configs/env-config';
import { QUEUE_NAMES } from 'src/queue';
import { MAIL_PROVIDER } from './constants';
import { MailProcessor } from './processors';
import { ResendMailProvider, SmtpMailProvider } from './providers';
import { MailQueueService } from './services';
import type { IMailProvider } from './types';

@Module({
  imports: [BullModule.registerQueue({ name: QUEUE_NAMES.MAIL })],
  providers: [
    MailProcessor,
    MailQueueService,
    {
      provide: MAIL_PROVIDER,
      useFactory: (configService: ConfigService): IMailProvider =>
        isProductionEnv(configService)
          ? new ResendMailProvider(configService)
          : new SmtpMailProvider(configService),
      inject: [ConfigService],
    },
  ],
  exports: [MAIL_PROVIDER, MailQueueService],
})
export class MailModule {}
