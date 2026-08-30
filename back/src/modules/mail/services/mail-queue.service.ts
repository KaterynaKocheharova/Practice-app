import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bullmq';

import { QUEUE_NAMES } from 'src/queue/constants/queue-names.constant';
import { MAIL_JOB_NAMES } from '../constants';
import type { SendEmailJobData, SendEmailOptions } from '../types';

@Injectable()
export class MailQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.MAIL)
    private readonly mailQueue: Queue<SendEmailJobData>,
  ) {}

  async enqueueSendEmail(options: SendEmailOptions): Promise<void> {
    await this.mailQueue.add(MAIL_JOB_NAMES.SEND_EMAIL, options, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: true,
      removeOnFail: 100,
    });
  }
}
