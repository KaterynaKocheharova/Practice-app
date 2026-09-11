import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isProductionEnv } from 'src/common/configs/env-config';
import { mailConfig } from './config';
import { MailProcessor } from './processors';
import { ResendMailProvider, SmtpMailProvider } from './providers';
import { MailQueueService } from './services';
import type { IMailProvider } from './types';

@Module({
  imports: [BullModule.registerQueue({ name: mailConfig.QUEUE.NAME })],
  providers: [
    MailProcessor,
    MailQueueService,
    {
      provide: mailConfig.PROVIDER,
      useFactory: (configService: ConfigService): IMailProvider =>
        isProductionEnv(configService)
          ? new ResendMailProvider(configService)
          : new SmtpMailProvider(configService),
      inject: [ConfigService],
    },
  ],
  exports: [mailConfig.PROVIDER, MailQueueService],
})
export class MailModule {}
