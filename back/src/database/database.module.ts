import { Module } from '@nestjs/common';
import { DatabaseConfig } from './config/config';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { ENV_NAMES } from 'src/common/configs/env-names';
import { drizzle } from 'drizzle-orm/node-postgres';

@Module({
  providers: [
    {
      provide: DatabaseConfig.DATABASE_INJECTION_TOKEN,
      useFactory: (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: configService.getOrThrow(ENV_NAMES.DATABASE_URL),
        });

        return drizzle({ client: pool });
      },
      inject: [ConfigService],
    },
  ],
})
export class DatabaseModule {}
