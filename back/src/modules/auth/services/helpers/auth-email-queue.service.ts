import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bullmq';

import { QUEUE_NAMES } from 'src/queue/constants/queue-names.constant';
import { AUTH_EMAIL_JOB_NAMES } from '../../constants';
import type { SignupVerificationEmailJobData } from '../../types';

@Injectable()
export class AuthEmailQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.AUTH_EMAIL)
    private readonly authEmailQueue: Queue<SignupVerificationEmailJobData>,
  ) {}

  async enqueueSignupVerificationEmail(
    data: SignupVerificationEmailJobData,
  ): Promise<void> {
    await this.authEmailQueue.add(
      AUTH_EMAIL_JOB_NAMES.SEND_SIGNUP_VERIFICATION,
      data,
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
      },
    );
  }
}
