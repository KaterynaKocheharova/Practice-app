import { mediaAssets } from '../../schemas/schema';

export const mediaAssetIdSelectFields = {
  id: mediaAssets.id,
};

export const pendingMediaAssetSelectFields = {
  id: mediaAssets.id,
  storageKey: mediaAssets.storageKey,
  originalName: mediaAssets.originalName,
  mimeType: mediaAssets.mimeType,
  sizeBytes: mediaAssets.sizeBytes,
};

export const storedMediaAssetSelectFields = {
  id: mediaAssets.id,
  storageKey: mediaAssets.storageKey,
};
