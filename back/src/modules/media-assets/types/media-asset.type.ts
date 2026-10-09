import type { mediaAssets } from '../schemas/schema';

type MediaAssetRowData = typeof mediaAssets.$inferSelect;

export type CreateMediaAssetData = typeof mediaAssets.$inferInsert;

export type CreatedMediaAssetData = Pick<MediaAssetRowData, 'id'>;

export type MediaAssetUploadRequest = Pick<
  MediaAssetRowData,
  'mimeType' | 'sizeBytes'
> & {
  fileName: string;
};

export type RequestMediaAssetUploadParams = MediaAssetUploadRequest & {
  uploaderId: string;
};

export type MediaAssetUploadResponse = {
  mediaAssetId: string;
  uploadUrl: string;
};

export type PendingMediaAssetLookupParams = {
  mediaAssetId: string;
  uploaderId: string;
};

export type PendingMediaAssetData = Pick<
  MediaAssetRowData,
  'id' | 'storageKey' | 'originalName' | 'mimeType' | 'sizeBytes'
>;

/** What deleting an asset needs: the row and its object in storage. */
export type StoredMediaAssetData = Pick<MediaAssetRowData, 'id' | 'storageKey'>;

export type MediaAssetDownloadParams = Pick<
  MediaAssetRowData,
  'storageKey' | 'originalName'
>;
