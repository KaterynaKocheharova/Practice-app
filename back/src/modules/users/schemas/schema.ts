import { sql } from 'drizzle-orm';
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { UserAuthProvider, UserRole, UserStatus } from '../enums';

export const userRoleEnum = pgEnum('user_role', UserRole);
export const userStatusEnum = pgEnum('user_status', UserStatus);

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).unique(),
    passwordHash: text('password_hash'),
    authProvider: varchar('auth_provider', { length: 50 })
      .$type<UserAuthProvider>()
      .notNull()
      .default(UserAuthProvider.Local),
    googleId: text('google_id').unique(),
    avatarUrl: text('avatar_url'),
    role: userRoleEnum('role').notNull(),
    status: userStatusEnum('status')
      .notNull()
      .default(UserStatus.VerificationInProgress),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    // Emails are stored lowercased; this also rejects case-variant duplicates
    // written by any path that skips normalization.
    uniqueIndex('users_email_lower_unique').on(sql`lower(${table.email})`),
  ],
);
