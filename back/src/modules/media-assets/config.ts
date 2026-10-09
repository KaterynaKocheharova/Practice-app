import { MediaAssetKind } from './enums';

const BYTES_IN_MEGABYTE = 1024 * 1024;
const HOUR_MS = 60 * 60 * 1000;

export const mediaAssetsConfig = {
  QUEUE: {
    NAME: 'media-assets',
  },
  JOBS: {
    CLEANUP_STALE_ASSETS: 'cleanup-stale-assets',
  },
  CLEANUP: {
    SCHEDULER_ID: 'media-assets-cleanup',
    /** Daily at 03:00 server time. */
    CRON_PATTERN: '0 3 * * *',
    PENDING_TTL_MS: 24 * HOUR_MS,
    BATCH_SIZE: 100,
    JOB_OPTIONS: { removeOnComplete: true, removeOnFail: 100 },
  },
  UPLOAD: {
    KEY_PREFIX: 'uploads',
    URL_EXPIRES_IN_SECONDS: 300,
  },
  DOWNLOAD: {
    URL_EXPIRES_IN_SECONDS: 300,
  },
  /** The only accepted content types, and the kind each one is stored as. */
  ALLOWED_MIME_TYPES: {
    'application/pdf': MediaAssetKind.Document,
    'application/msword': MediaAssetKind.Document,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      MediaAssetKind.Document,
    'application/vnd.ms-excel': MediaAssetKind.Document,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      MediaAssetKind.Document,
    'application/vnd.ms-powerpoint': MediaAssetKind.Document,
    'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      MediaAssetKind.Document,
    'application/vnd.oasis.opendocument.text': MediaAssetKind.Document,
    'application/vnd.oasis.opendocument.spreadsheet': MediaAssetKind.Document,
    'text/plain': MediaAssetKind.Document,
    'text/csv': MediaAssetKind.Document,
    'image/jpeg': MediaAssetKind.Image,
    'image/png': MediaAssetKind.Image,
    'image/webp': MediaAssetKind.Image,
    'audio/mpeg': MediaAssetKind.Audio,
    'audio/mp4': MediaAssetKind.Audio,
    'audio/x-m4a': MediaAssetKind.Audio,
    'audio/wav': MediaAssetKind.Audio,
    'audio/x-wav': MediaAssetKind.Audio,
    'audio/ogg': MediaAssetKind.Audio,
  } as Record<string, MediaAssetKind>,
  MAX_SIZE_BYTES: {
    [MediaAssetKind.Document]: 20 * BYTES_IN_MEGABYTE,
    [MediaAssetKind.Image]: 10 * BYTES_IN_MEGABYTE,
    [MediaAssetKind.Audio]: 50 * BYTES_IN_MEGABYTE,
  },
  VALIDATION: {
    FILE_NAME_MAX_LENGTH: 255,
    MIME_TYPE_MAX_LENGTH: 255,
    STORAGE_KEY_MAX_LENGTH: 512,
  },
} as const;
