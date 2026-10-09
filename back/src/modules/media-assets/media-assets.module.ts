import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { StorageModule } from '../../common/storage';
import { DatabaseModule } from '../../database/database.module';
import { mediaAssetsConfig } from './config';
import { MediaAssetsProcessor } from './processors/media-assets.processor';
import { MediaAssetsRepository } from './repositories/media-assets.repository';
import {
  MediaAssetsCleanupSchedulerService,
  MediaAssetsService,
  MediaAssetUploadService,
} from './services';

@Module({
  imports: [
    BullModule.registerQueue({ name: mediaAssetsConfig.QUEUE.NAME }),
    DatabaseModule,
    StorageModule,
  ],
  providers: [
    MediaAssetsRepository,
    MediaAssetsService,
    MediaAssetUploadService,
    MediaAssetsCleanupSchedulerService,
    MediaAssetsProcessor,
  ],
  exports: [MediaAssetsService, MediaAssetUploadService],
})
export class MediaAssetsModule {}
