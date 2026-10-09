import { mediaAssets } from '../../../media-assets/schemas/schema';
import { users } from '../../../users/schemas/schema';
import { courseDocuments } from '../../schemas/schema';

export const courseDocumentIdSelectFields = {
  id: courseDocuments.id,
};

export const courseDocumentListSelectFields = {
  id: courseDocuments.id,
  type: courseDocuments.type,
  title: courseDocuments.title,
  url: courseDocuments.url,
  addedByUserId: courseDocuments.addedByUserId,
  addedByName: users.name,
  addedByRole: users.role,
  fileSizeBytes: mediaAssets.sizeBytes,
  fileKind: mediaAssets.kind,
};

export const courseDocumentAuthorSelectFields = {
  addedByUserId: courseDocuments.addedByUserId,
};

export const courseDocumentFileSelectFields = {
  storageKey: mediaAssets.storageKey,
  originalName: mediaAssets.originalName,
};

export const deletedCourseDocumentSelectFields = {
  id: courseDocuments.id,
  mediaAssetId: courseDocuments.mediaAssetId,
};
