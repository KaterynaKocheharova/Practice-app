import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import type { Job } from 'bullmq';
import { MAIL_PROVIDER } from 'src/modules/mail';
import type { IMailProvider } from 'src/modules/mail';
import { QUEUE_NAMES } from 'src/queue/constants/queue-names.constant';
import { AUTH_EMAIL_JOB_NAMES } from '../constants';
import { createSignupVerificationEmailTemplate } from '../templates';
import type { SignupVerificationEmailJobData } from '../types';

@Processor(QUEUE_NAMES.AUTH_EMAIL)
export class AuthEmailProcessor extends WorkerHost {
  constructor(
    @Inject(MAIL_PROVIDER)
    private readonly mailProvider: IMailProvider,
  ) {
    super();
  }

  async process(job: Job<SignupVerificationEmailJobData>): Promise<void> {
    if (job.name !== AUTH_EMAIL_JOB_NAMES.SEND_SIGNUP_VERIFICATION) {
      throw new Error(`Unsupported auth email job: ${job.name}`);
    }

    await this.mailProvider.sendEmail(
      createSignupVerificationEmailTemplate(job.data),
    );
  }
}
