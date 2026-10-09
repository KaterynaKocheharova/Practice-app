import type { StorageDriver } from './enums';
import type {
  CreateDownloadUrlParams,
  CreateUploadUrlParams,
  StoredObjectInfo,
} from './types';

/**
 * Object storage strategy. Inject this abstract class; `StorageModule` binds
 * the implementation selected by `STORAGE_DRIVER`. Buckets stay private, so
 * clients only ever get short-lived presigned URLs.
 */
export abstract class StorageProvider {
  abstract readonly driver: StorageDriver;

  /** Presigned PUT URL bound to the key, content type and exact size. */
  abstract createUploadUrl(params: CreateUploadUrlParams): Promise<string>;

  /** Presigned GET URL that opens the file inline when the browser can show it. */
  abstract createDownloadUrl(params: CreateDownloadUrlParams): Promise<string>;

  /** `null` when no object exists under the key. */
  abstract getObjectInfo(key: string): Promise<StoredObjectInfo | null>;

  /** Idempotent: deleting a missing key succeeds. */
  abstract deleteObject(key: string): Promise<void>;
}
