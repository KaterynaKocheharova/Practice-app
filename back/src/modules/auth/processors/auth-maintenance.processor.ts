import { Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';

import { authConfig } from '../config';
import { VerificationLinksRepository } from '../repositories';

@Processor(authConfig.QUEUES.MAINTENANCE)
export class AuthMaintenanceProcessor extends WorkerHost {
  constructor(
    private readonly verificationLinksRepository: VerificationLinksRepository,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    if (job.name !== authConfig.JOBS.CLEANUP_EXPIRED_VERIFICATION_LINKS) {
      throw new Error(`Unsupported auth maintenance job: ${job.name}`);
    }

    await this.verificationLinksRepository.deleteExpiredVerificationLinks(
      new Date(),
    );
  }
}
