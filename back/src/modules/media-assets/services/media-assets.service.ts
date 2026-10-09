import { Injectable } from '@nestjs/common';

import { StorageProvider } from '../../../common/storage';
import { mediaAssetsConfig } from '../config';
import { MediaAssetsRepository } from '../repositories/media-assets.repository';
import type { MediaAssetDownloadParams, StoredMediaAssetData } from '../types';

const { CLEANUP, DOWNLOAD } = mediaAssetsConfig;

@Injectable()
export class MediaAssetsService {
  constructor(
    private readonly mediaAssetsRepository: MediaAssetsRepository,
    private readonly storageProvider: StorageProvider,
  ) {}

  createDownloadUrl({
    storageKey,
    originalName,
  }: MediaAssetDownloadParams): Promise<string> {
    return this.storageProvider.createDownloadUrl({
      key: storageKey,
      fileName: originalName,
      expiresInSeconds: DOWNLOAD.URL_EXPIRES_IN_SECONDS,
    });
  }

  /**
   * Removes the object, then the row (rows referencing the asset cascade).
   * Safe to retry: a missing asset or object is treated as already deleted.
   */
  async deleteMediaAsset(mediaAssetId: string): Promise<void> {
    const asset =
      await this.mediaAssetsRepository.getStoredMediaAsset(mediaAssetId);

    if (asset) {
      await this.deleteStoredAsset(asset);
    }
  }

  /** Deletes uploads that were never attached within the pending TTL. */
  async deleteStalePendingAssets(): Promise<void> {
    const createdBefore = new Date(Date.now() - CLEANUP.PENDING_TTL_MS);
    let assets: StoredMediaAssetData[];

    do {
      assets = await this.mediaAssetsRepository.getStalePendingMediaAssets(
        createdBefore,
        CLEANUP.BATCH_SIZE,
      );

      for (const asset of assets) {
        await this.deleteStoredAsset(asset);
      }
    } while (assets.length === CLEANUP.BATCH_SIZE);
  }

  private async deleteStoredAsset({
    id,
    storageKey,
  }: StoredMediaAssetData): Promise<void> {
    await this.storageProvider.deleteObject(storageKey);
    await this.mediaAssetsRepository.deleteMediaAsset(id);
  }
}
