import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { UserRole, UserStatus } from '../enums';

export const userRoleEnum = pgEnum('user_role', UserRole);
export const userStatusEnum = pgEnum('user_status', UserStatus);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash'),
  authProvider: varchar('auth_provider', { length: 50 })
    .notNull()
    .default('local'),
  googleId: text('google_id').unique(),
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
});
