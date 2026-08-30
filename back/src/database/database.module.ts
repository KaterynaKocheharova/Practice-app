import { Module } from '@nestjs/common';
import { DatabaseConfig } from './config/config';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { getDatabaseEnvConfig } from 'src/common/configs/env-config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DatabaseErrorMapper } from './filters';

const databaseProvider = {
  provide: DatabaseConfig.DATABASE_INJECTION_TOKEN,
  useFactory: (configService: ConfigService) => {
    const { url: connectionString } = getDatabaseEnvConfig(configService);
    const pool = new Pool({
      connectionString,
    });

    return drizzle({
      client: pool,
    });
  },
  inject: [ConfigService],
};

@Module({
  providers: [databaseProvider, DatabaseErrorMapper],
  exports: [databaseProvider, DatabaseErrorMapper],
})
export class DatabaseModule {}
