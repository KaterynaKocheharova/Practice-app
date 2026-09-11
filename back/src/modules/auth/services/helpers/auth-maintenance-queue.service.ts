import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, OnModuleInit } from '@nestjs/common';
import type { Queue } from 'bullmq';

import { authConfig } from '../../config';

@Injectable()
export class AuthMaintenanceQueueService implements OnModuleInit {
  constructor(
    @InjectQueue(authConfig.QUEUES.MAINTENANCE)
    private readonly authMaintenanceQueue: Queue,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.authMaintenanceQueue.upsertJobScheduler(
      authConfig.VERIFICATION_CLEANUP.JOB_ID,
      { every: authConfig.VERIFICATION_CLEANUP.EVERY_MS },
      {
        name: authConfig.JOBS.CLEANUP_EXPIRED_VERIFICATION_LINKS,
        data: {},
        opts: { removeOnComplete: true },
      },
    );
  }
}
