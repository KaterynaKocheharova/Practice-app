import { randomUUID } from 'node:crypto';

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ERROR_CODE } from '../../../common/constants/errors/error-code.constant';
import {
  StorageProvider,
  type StoredObjectInfo,
} from '../../../common/storage';
import { mediaAssetsConfig } from '../config';
import { MediaAssetsRepository } from '../repositories/media-assets.repository';
import type {
  MediaAssetUploadResponse,
  PendingMediaAssetData,
  PendingMediaAssetLookupParams,
  RequestMediaAssetUploadParams,
} from '../types';

const { ALLOWED_MIME_TYPES, UPLOAD } = mediaAssetsConfig;

/**
 * Direct-to-storage uploads: issue a presigned URL for a `pending` asset,
 * then verify the stored object before a feature attaches the asset.
 */
@Injectable()
export class MediaAssetUploadService {
  constructor(
    private readonly mediaAssetsRepository: MediaAssetsRepository,
    private readonly storageProvider: StorageProvider,
  ) {}

  async requestUpload({
    uploaderId,
    fileName,
    mimeType,
    sizeBytes,
  }: RequestMediaAssetUploadParams): Promise<MediaAssetUploadResponse> {
    await this.ensureUploaderHasPendingCapacity(uploaderId);

    const kind = ALLOWED_MIME_TYPES[mimeType];
    const storageKey = this.createStorageKey(uploaderId);
    const { id } = await this.mediaAssetsRepository.createMediaAsset({
      provider: this.storageProvider.driver,
      storageKey,
      originalName: fileName,
      mimeType,
      sizeBytes,
      kind,
      uploadedByUserId: uploaderId,
    });
    const uploadUrl = await this.storageProvider.createUploadUrl({
      key: storageKey,
      mimeType,
      sizeBytes,
      expiresInSeconds: UPLOAD.URL_EXPIRES_IN_SECONDS,
    });

    return { mediaAssetId: id, uploadUrl };
  }

  /**
   * The uploader's pending asset, once its object exists in storage with the
   * size and type requested. A rejected object stays `pending` and is removed
   * by the stale-asset cleanup.
   */
  async getVerifiedPendingAsset(
    params: PendingMediaAssetLookupParams,
  ): Promise<PendingMediaAssetData> {
    const asset = await this.mediaAssetsRepository.getPendingMediaAsset(params);

    if (!asset) {
      throw new NotFoundException({
        errorCode: ERROR_CODE.MEDIA_ASSET_NOT_FOUND,
      });
    }

    const storedObject = await this.storageProvider.getObjectInfo(
      asset.storageKey,
    );

    if (!this.isStoredObjectMatching(asset, storedObject)) {
      throw new BadRequestException({
        errorCode: ERROR_CODE.MEDIA_ASSET_UPLOAD_INVALID,
      });
    }

    return asset;
  }

  private async ensureUploaderHasPendingCapacity(
    uploaderId: string,
  ): Promise<void> {
    const pendingTotal =
      await this.mediaAssetsRepository.countPendingMediaAssets(uploaderId);

    if (pendingTotal >= UPLOAD.MAX_PENDING_PER_UPLOADER) {
      throw new ConflictException({
        errorCode: ERROR_CODE.MEDIA_ASSET_PENDING_LIMIT_REACHED,
      });
    }
  }

  private isStoredObjectMatching(
    asset: PendingMediaAssetData,
    storedObject: StoredObjectInfo | null,
  ): boolean {
    return (
      storedObject !== null &&
      storedObject.sizeBytes === asset.sizeBytes &&
      storedObject.mimeType === asset.mimeType
    );
  }

  /** Server-chosen and unguessable; the client never picks a key. */
  private createStorageKey(uploaderId: string): string {
    return `${UPLOAD.KEY_PREFIX}/${uploaderId}/${randomUUID()}`;
  }
}
