import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import type { Job } from 'bullmq';
import { QUEUE_NAMES } from 'src/queue';
import { MAIL_JOB_NAMES, MAIL_PROVIDER } from '../constants';
import type { IMailProvider, SendEmailJobData } from '../types';

@Processor(QUEUE_NAMES.MAIL)
export class MailProcessor extends WorkerHost {
  constructor(
    @Inject(MAIL_PROVIDER)
    private readonly mailProvider: IMailProvider,
  ) {
    super();
  }

  async process(job: Job<SendEmailJobData>): Promise<void> {
    if (job.name !== MAIL_JOB_NAMES.SEND_EMAIL) {
      throw new Error(`Unsupported mail job: ${job.name}`);
    }

    await this.mailProvider.sendEmail(job.data);
  }
}
