import {
  index,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { StorageDriver } from '../../../common/storage/enums';
import { users } from '../../users/schemas/schema';
import { mediaAssetsConfig } from '../config';
import { MediaAssetKind, MediaAssetStatus } from '../enums';

const { VALIDATION } = mediaAssetsConfig;

export const storageDriverEnum = pgEnum('storage_driver', StorageDriver);
export const mediaAssetKindEnum = pgEnum('media_asset_kind', MediaAssetKind);
export const mediaAssetStatusEnum = pgEnum(
  'media_asset_status',
  MediaAssetStatus,
);

export const mediaAssets = pgTable(
  'media_assets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    provider: storageDriverEnum('provider').notNull(),
    storageKey: varchar('storage_key', {
      length: VALIDATION.STORAGE_KEY_MAX_LENGTH,
    })
      .notNull()
      .unique(),
    originalName: varchar('original_name', {
      length: VALIDATION.FILE_NAME_MAX_LENGTH,
    }).notNull(),
    mimeType: varchar('mime_type', {
      length: VALIDATION.MIME_TYPE_MAX_LENGTH,
    }).notNull(),
    sizeBytes: integer('size_bytes').notNull(),
    kind: mediaAssetKindEnum('kind').notNull(),
    status: mediaAssetStatusEnum('status')
      .notNull()
      .default(MediaAssetStatus.Pending),
    uploadedByUserId: uuid('uploaded_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('media_assets_uploaded_by_user_id_idx').on(table.uploadedByUserId),
    index('media_assets_status_created_at_idx').on(
      table.status,
      table.createdAt,
    ),
  ],
);
