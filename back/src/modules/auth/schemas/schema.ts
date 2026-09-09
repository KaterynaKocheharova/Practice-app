import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core';

import { users } from '../../users/schemas/schema';
import { SignupVerificationTokenPurpose } from '../enums';

export const verificationLinkPurposeEnum = pgEnum(
  'verification_link_purpose',
  SignupVerificationTokenPurpose,
);

export const authSessions = pgTable(
  'auth_sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    hashedRefreshToken: text('hashed_refresh_token').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    replacedBy: uuid('replaced_by').references(
      (): AnyPgColumn => authSessions.id,
    ),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index('auth_sessions_user_id_idx').on(table.userId)],
);

export const verificationLinks = pgTable(
  'verification_links',
  {
    id: uuid('id').primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    purpose: verificationLinkPurposeEnum('purpose').notNull(),
    hashedToken: text('hashed_token').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    usedAt: timestamp('used_at', { withTimezone: true }),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('verification_links_user_id_purpose_idx').on(
      table.userId,
      table.purpose,
    ),
    index('verification_links_expires_at_idx').on(table.expiresAt),
  ],
);
