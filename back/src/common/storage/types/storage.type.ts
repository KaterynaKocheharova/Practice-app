export type CreateUploadUrlParams = {
  key: string;
  mimeType: string;
  sizeBytes: number;
  expiresInSeconds: number;
};

export type CreateDownloadUrlParams = {
  key: string;
  /** Name the browser saves the file under. */
  fileName: string;
  expiresInSeconds: number;
};

export type StoredObjectInfo = {
  sizeBytes: number;
  mimeType: string;
};
