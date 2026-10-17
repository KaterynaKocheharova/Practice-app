import { Processor } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import type { Job } from 'bullmq';
import { LoggedWorkerHost } from 'src/queue';
import { mailConfig } from '../config';
import type { IMailProvider, SendEmailJobData } from '../types';

@Processor(mailConfig.QUEUE.NAME)
export class MailProcessor extends LoggedWorkerHost {
  constructor(
    @Inject(mailConfig.PROVIDER)
    private readonly mailProvider: IMailProvider,
  ) {
    super();
  }

  async process(job: Job<SendEmailJobData>): Promise<void> {
    if (job.name !== mailConfig.JOBS.SEND_EMAIL) {
      throw new Error(`Unsupported mail job: ${job.name}`);
    }

    await this.mailProvider.sendEmail(job.data);
  }
}
