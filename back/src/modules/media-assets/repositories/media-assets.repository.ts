import { Inject, Injectable } from '@nestjs/common';
import { and, asc, eq, lt } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DatabaseConfig } from '../../../database/config/config';
import { HandleDatabaseError } from '../../../database/decorators';
import {
  mediaAssetIdSelectFields,
  pendingMediaAssetSelectFields,
  storedMediaAssetSelectFields,
} from '../constants/repository';
import { MediaAssetStatus } from '../enums';
import { mediaAssets } from '../schemas/schema';
import type {
  CreateMediaAssetData,
  CreatedMediaAssetData,
  PendingMediaAssetData,
  PendingMediaAssetLookupParams,
  StoredMediaAssetData,
} from '../types';

@Injectable()
export class MediaAssetsRepository {
  constructor(
    @Inject(DatabaseConfig.DATABASE_INJECTION_TOKEN)
    private readonly database: NodePgDatabase,
  ) {}

  @HandleDatabaseError()
  async createMediaAsset(
    asset: CreateMediaAssetData,
  ): Promise<CreatedMediaAssetData> {
    const [createdAsset] = await this.database
      .insert(mediaAssets)
      .values(asset)
      .returning(mediaAssetIdSelectFields);

    return createdAsset;
  }

  /** A not-yet-attached asset, only if the given user requested its upload. */
  @HandleDatabaseError()
  async getPendingMediaAsset({
    mediaAssetId,
    uploaderId,
  }: PendingMediaAssetLookupParams): Promise<
    PendingMediaAssetData | undefined
  > {
    const [asset] = await this.database
      .select(pendingMediaAssetSelectFields)
      .from(mediaAssets)
      .where(
        and(
          eq(mediaAssets.id, mediaAssetId),
          eq(mediaAssets.uploadedByUserId, uploaderId),
          eq(mediaAssets.status, MediaAssetStatus.Pending),
        ),
      )
      .limit(1);

    return asset;
  }

  @HandleDatabaseError()
  async getStoredMediaAsset(
    mediaAssetId: string,
  ): Promise<StoredMediaAssetData | undefined> {
    const [asset] = await this.database
      .select(storedMediaAssetSelectFields)
      .from(mediaAssets)
      .where(eq(mediaAssets.id, mediaAssetId))
      .limit(1);

    return asset;
  }

  /** Oldest first, so repeated batches always make progress. */
  @HandleDatabaseError()
  async getStalePendingMediaAssets(
    createdBefore: Date,
    limit: number,
  ): Promise<StoredMediaAssetData[]> {
    return this.database
      .select(storedMediaAssetSelectFields)
      .from(mediaAssets)
      .where(
        and(
          eq(mediaAssets.status, MediaAssetStatus.Pending),
          lt(mediaAssets.createdAt, createdBefore),
        ),
      )
      .orderBy(asc(mediaAssets.createdAt))
      .limit(limit);
  }

  @HandleDatabaseError()
  async deleteMediaAsset(mediaAssetId: string): Promise<void> {
    await this.database
      .delete(mediaAssets)
      .where(eq(mediaAssets.id, mediaAssetId));
  }
}
