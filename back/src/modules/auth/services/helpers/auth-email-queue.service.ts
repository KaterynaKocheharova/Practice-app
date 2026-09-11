import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bullmq';

import { authConfig } from '../../config';
import type {
  SigninVerificationEmailJobData,
  SignupVerificationEmailJobData,
} from '../../types';

type AuthEmailJobData =
  SigninVerificationEmailJobData | SignupVerificationEmailJobData;

@Injectable()
export class AuthEmailQueueService {
  constructor(
    @InjectQueue(authConfig.QUEUES.EMAIL)
    private readonly authEmailQueue: Queue<AuthEmailJobData>,
  ) {}

  async enqueueSigninVerificationEmail(
    data: SigninVerificationEmailJobData,
  ): Promise<void> {
    await this.authEmailQueue.add(
      authConfig.JOBS.SEND_SIGNIN_VERIFICATION,
      data,
      this.createJobOptions(),
    );
  }

  async enqueueSignupVerificationEmail(
    data: SignupVerificationEmailJobData,
  ): Promise<void> {
    await this.authEmailQueue.add(
      authConfig.JOBS.SEND_SIGNUP_VERIFICATION,
      data,
      this.createJobOptions(),
    );
  }

  private createJobOptions() {
    return {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: true,
    };
  }
}
