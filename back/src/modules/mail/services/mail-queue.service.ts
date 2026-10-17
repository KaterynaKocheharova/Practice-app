import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import type { Queue } from 'bullmq';

import { mailConfig } from '../config';
import type { SendEmailJobData, SendEmailOptions } from '../types';

@Injectable()
export class MailQueueService {
  private readonly logger = new Logger(MailQueueService.name);

  constructor(
    @InjectQueue(mailConfig.QUEUE.NAME)
    private readonly mailQueue: Queue<SendEmailJobData>,
  ) {}

  async enqueueSendEmail(options: SendEmailOptions): Promise<void> {
    try {
      await this.mailQueue.add(mailConfig.JOBS.SEND_EMAIL, options, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: 100,
      });
    } catch (error) {
      this.logger.error(
        `Failed to enqueue ${mailConfig.QUEUE.NAME}/${mailConfig.JOBS.SEND_EMAIL}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
