import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { BullRootModuleOptions } from '@nestjs/bullmq';

import { getRedisEnvConfig } from 'src/common/configs/env-config';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService): BullRootModuleOptions => {
        const { host, port, password, db } = getRedisEnvConfig(configService);

        return {
          connection: {
            host,
            port,
            password,
            db,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
