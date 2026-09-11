import { Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import { authConfig } from '../config';
import type {
  SigninVerificationEmailJobData,
  SignupVerificationEmailJobData,
} from '../types';
import { SigninVerificationEmailProcessor } from './signin-verification-email.processor';
import { SignupVerificationEmailProcessor } from './signup-verification-email.processor';

type AuthEmailJobData =
  SigninVerificationEmailJobData | SignupVerificationEmailJobData;
type AuthEmailJobProcessor = (data: AuthEmailJobData) => Promise<void>;

@Processor(authConfig.QUEUES.EMAIL)
export class AuthEmailProcessor extends WorkerHost {
  private readonly jobProcessors: Record<string, AuthEmailJobProcessor>;

  constructor(
    private readonly signinVerificationEmailProcessor: SigninVerificationEmailProcessor,
    private readonly signupVerificationEmailProcessor: SignupVerificationEmailProcessor,
  ) {
    super();

    this.jobProcessors = {
      [authConfig.JOBS.SEND_SIGNIN_VERIFICATION]: (data) =>
        this.signinVerificationEmailProcessor.process(
          data as SigninVerificationEmailJobData,
        ),
      [authConfig.JOBS.SEND_SIGNUP_VERIFICATION]: (data) =>
        this.signupVerificationEmailProcessor.process(
          data as SignupVerificationEmailJobData,
        ),
    };
  }

  async process(job: Job<AuthEmailJobData>): Promise<void> {
    const jobProcessor = this.jobProcessors[job.name];

    if (!jobProcessor) {
      throw new Error(`Unsupported auth email job: ${job.name}`);
    }

    await jobProcessor(job.data);
  }
}
