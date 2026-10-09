import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import type { S3EnvConfig } from '../../types/env';
import { storageConfig } from '../config';
import { StorageDriver } from '../enums';
import { StorageProvider } from '../storage-provider';
import type {
  CreateDownloadUrlParams,
  CreateUploadUrlParams,
  StoredObjectInfo,
} from '../types';

const { S3 } = storageConfig;

/** AWS S3 or any S3-compatible service (MinIO, Cloudflare R2). */
export class S3StorageProvider extends StorageProvider {
  readonly driver = StorageDriver.S3;

  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(config: S3EnvConfig) {
    super();
    this.bucket = config.bucket;
    this.client = new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      forcePathStyle: config.forcePathStyle,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      requestChecksumCalculation: S3.CHECKSUM_MODE,
      responseChecksumValidation: S3.CHECKSUM_MODE,
    });
  }

  createUploadUrl({
    key,
    mimeType,
    sizeBytes,
    expiresInSeconds,
  }: CreateUploadUrlParams): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: mimeType,
      ContentLength: sizeBytes,
    });

    return getSignedUrl(this.client, command, {
      expiresIn: expiresInSeconds,
      signableHeaders: new Set(S3.SIGNED_UPLOAD_HEADERS),
    });
  }

  createDownloadUrl({
    key,
    fileName,
    expiresInSeconds,
  }: CreateDownloadUrlParams): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ResponseContentDisposition: this.toInlineDisposition(fileName),
    });

    return getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
  }

  async getObjectInfo(key: string): Promise<StoredObjectInfo | null> {
    try {
      const object = await this.client.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: key }),
      );

      return {
        sizeBytes: object.ContentLength ?? 0,
        mimeType: object.ContentType ?? '',
      };
    } catch (error) {
      if (this.isNotFoundError(error)) {
        return null;
      }

      throw error;
    }
  }

  async deleteObject(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }

  private isNotFoundError(error: unknown): boolean {
    return (
      error instanceof S3ServiceException &&
      error.$metadata.httpStatusCode === S3.NOT_FOUND_STATUS_CODE
    );
  }

  /**
   * `inline` lets the browser show what it can (PDF, images, audio, text);
   * other types still download. The file name is kept for "Save as";
   * RFC 5987 encoding keeps non-ASCII names intact.
   */
  private toInlineDisposition(fileName: string): string {
    const encodedName = encodeURIComponent(fileName).replace(
      /['()*]/g,
      (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
    );

    return `inline; filename*=UTF-8''${encodedName}`;
  }
}
