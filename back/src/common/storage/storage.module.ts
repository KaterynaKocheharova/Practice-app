import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { getS3EnvConfig, getStorageEnvConfig } from '../configs/env-config';
import { StorageDriver } from './enums';
import { S3StorageProvider } from './providers/s3-storage.provider';
import { StorageProvider } from './storage-provider';

/** Binds `StorageProvider` to the driver chosen by `STORAGE_DRIVER`. */
@Module({
  providers: [
    {
      provide: StorageProvider,
      useFactory: (configService: ConfigService): StorageProvider => {
        const { driver } = getStorageEnvConfig(configService);

        switch (driver) {
          case StorageDriver.S3:
            return new S3StorageProvider(getS3EnvConfig(configService));
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: [StorageProvider],
})
export class StorageModule {}
