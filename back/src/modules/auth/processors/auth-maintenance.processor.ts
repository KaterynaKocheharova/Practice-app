import { Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';

import { QUEUE_NAMES } from 'src/queue/constants/queue-names.constant';
import { AUTH_JOB_NAMES } from '../constants';
import { VerificationLinksRepository } from '../repositories';

@Processor(QUEUE_NAMES.AUTH_MAINTENANCE)
export class AuthMaintenanceProcessor extends WorkerHost {
  constructor(
    private readonly verificationLinksRepository: VerificationLinksRepository,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    if (job.name !== AUTH_JOB_NAMES.CLEANUP_EXPIRED_VERIFICATION_LINKS) {
      throw new Error(`Unsupported auth maintenance job: ${job.name}`);
    }

    await this.verificationLinksRepository.deleteExpiredVerificationLinks(
      new Date(),
    );
  }
}
