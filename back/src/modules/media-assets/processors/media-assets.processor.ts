import { Processor } from '@nestjs/bullmq';
import type { Job } from 'bullmq';

import { LoggedWorkerHost } from 'src/queue';
import { mediaAssetsConfig } from '../config';
import { MediaAssetsService } from '../services/media-assets.service';

@Processor(mediaAssetsConfig.QUEUE.NAME)
export class MediaAssetsProcessor extends LoggedWorkerHost {
  constructor(private readonly mediaAssetsService: MediaAssetsService) {
    super();
  }

  async process(job: Job): Promise<void> {
    if (job.name !== mediaAssetsConfig.JOBS.CLEANUP_STALE_ASSETS) {
      throw new Error(`Unsupported media assets job: ${job.name}`);
    }

    await this.mediaAssetsService.deleteStalePendingAssets();
  }
}
