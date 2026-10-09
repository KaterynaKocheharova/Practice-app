import type { StorageDriver } from '../../storage/enums';

export interface StorageEnvConfig {
  driver: StorageDriver;
}

export interface S3EnvConfig {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  /** Set only for S3-compatible services such as MinIO or R2. */
  endpoint?: string;
  forcePathStyle: boolean;
}
