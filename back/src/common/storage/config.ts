export const storageConfig = {
  S3: {
    /** Headers the browser must send unchanged when using an upload URL. */
    SIGNED_UPLOAD_HEADERS: ['content-type', 'content-length'],
    NOT_FOUND_STATUS_CODE: 404,
    /** Keeps SDK checksum headers out of presigned URLs browsers can't send. */
    CHECKSUM_MODE: 'WHEN_REQUIRED',
  },
} as const;
