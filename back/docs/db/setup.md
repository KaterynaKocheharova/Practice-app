# Database Setup

## Starter Setup

Install Drizzle ORM together with `pg`:

```bash
npm install drizzle-orm pg
```

Install `drizzle-kit` for migrations:

```bash
npm install -D drizzle-kit
```

Create a database module and use the PostgreSQL connection token from the app configuration.
Create the `pg` pool manually, then pass the pool to Drizzle from a NestJS `useFactory`.

```ts
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: configService.getOrThrow('DATABASE_URL'),
        });

        return drizzle({ client: pool });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
```

Create a table in a `schema.ts` file:

```ts
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
```

Set up `drizzle.config.ts` so Drizzle Kit can find schemas and create migrations:

```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/**/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
});
```

Generate a migration after creating or changing a schema:

```bash
npm run db:generate
```

Run migrations:

```bash
npm run db:migrate
```

For local development only, push schema changes directly:

```bash
npm run db:push
```
