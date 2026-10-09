import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, type OnModuleInit } from '@nestjs/common';
import type { Queue } from 'bullmq';

import { mediaAssetsConfig } from '../config';

const { CLEANUP, JOBS, QUEUE } = mediaAssetsConfig;

/** Registers the daily stale-asset cleanup; upserting keeps one schedule across restarts. */
@Injectable()
export class MediaAssetsCleanupSchedulerService implements OnModuleInit {
  constructor(
    @InjectQueue(QUEUE.NAME)
    private readonly mediaAssetsQueue: Queue,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.mediaAssetsQueue.upsertJobScheduler(
      CLEANUP.SCHEDULER_ID,
      { pattern: CLEANUP.CRON_PATTERN },
      {
        name: JOBS.CLEANUP_STALE_ASSETS,
        opts: CLEANUP.JOB_OPTIONS,
      },
    );
  }
}
