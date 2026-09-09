import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, OnModuleInit } from '@nestjs/common';
import type { Queue } from 'bullmq';

import { QUEUE_NAMES } from 'src/queue/constants/queue-names.constant';
import { AUTH_JOB_NAMES, AUTH_VERIFICATION_CLEANUP } from '../../constants';

@Injectable()
export class AuthMaintenanceQueueService implements OnModuleInit {
  constructor(
    @InjectQueue(QUEUE_NAMES.AUTH_MAINTENANCE)
    private readonly authMaintenanceQueue: Queue,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.authMaintenanceQueue.upsertJobScheduler(
      AUTH_VERIFICATION_CLEANUP.JOB_ID,
      { every: AUTH_VERIFICATION_CLEANUP.EVERY_MS },
      {
        name: AUTH_JOB_NAMES.CLEANUP_EXPIRED_VERIFICATION_LINKS,
        data: {},
        opts: { removeOnComplete: true },
      },
    );
  }
}
