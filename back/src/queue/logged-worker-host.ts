import { OnWorkerEvent, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { UnrecoverableError, type Job } from 'bullmq';

import { queueConfig } from './config';

export abstract class LoggedWorkerHost extends WorkerHost {
  protected readonly logger = new Logger(this.constructor.name);

  @OnWorkerEvent('failed')
  onJobFailed(job: Job | undefined, error: Error): void {
    const message = `Job ${job?.queueName}/${job?.name}#${job?.id} failed (attempt ${job?.attemptsMade}): ${error.message}`;

    if (this.isFinalAttempt(job, error)) {
      this.logger.error(message, error.stack);
      return;
    }

    this.logger.warn(message);
  }

  private isFinalAttempt(job: Job | undefined, error: Error): boolean {
    const maxAttempts = job?.opts.attempts ?? queueConfig.DEFAULT_JOB_ATTEMPTS;

    return (
      !job ||
      job.attemptsMade >= maxAttempts ||
      error instanceof UnrecoverableError
    );
  }
}
