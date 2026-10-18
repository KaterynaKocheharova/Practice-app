import { sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { users } from '../../users/schemas/schema';
import { teachersConfig } from '../config';
import { GoalProgressStatus } from '../enums';

export const goalProgressStatusEnum = pgEnum(
  'goal_progress_status',
  GoalProgressStatus,
);

export const teachers = pgTable('teachers', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
});

/** A teacher's own improvement goal. `completedAt` is null while the goal is active. */
export const teacherGoals = pgTable(
  'teacher_goals',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    teacherId: uuid('teacher_id')
      .notNull()
      .references(() => teachers.userId, { onDelete: 'cascade' }),
    title: varchar('title', {
      length: teachersConfig.VALIDATION.GOAL_TITLE_MAX_LENGTH,
    }).notNull(),
    details: text('details'),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index('teacher_goals_teacher_id_idx').on(table.teacherId)],
);

/** One row per time the teacher ticks a goal as addressed. Append-only. */
export const teacherGoalAttempts = pgTable(
  'teacher_goal_attempts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    teacherGoalId: uuid('teacher_goal_id')
      .notNull()
      .references(() => teacherGoals.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('teacher_goal_attempts_goal_id_created_at_idx').on(
      table.teacherGoalId,
      table.createdAt,
    ),
  ],
);

/**
 * The teacher's answer to the progress question asked every
 * `PROGRESS_CHECK_INTERVAL` attempts; `attemptNumber` is the attempt that
 * triggered it.
 */
export const teacherGoalProgressChecks = pgTable(
  'teacher_goal_progress_checks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    teacherGoalId: uuid('teacher_goal_id')
      .notNull()
      .references(() => teacherGoals.id, { onDelete: 'cascade' }),
    attemptNumber: integer('attempt_number').notNull(),
    status: goalProgressStatusEnum('status').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique('teacher_goal_progress_checks_goal_attempt_unique').on(
      table.teacherGoalId,
      table.attemptNumber,
    ),
    check(
      'teacher_goal_progress_checks_attempt_number_check',
      sql`${table.attemptNumber} > 0 AND ${table.attemptNumber} % ${sql.raw(
        String(teachersConfig.GOALS.PROGRESS_CHECK_INTERVAL),
      )} = 0`,
    ),
  ],
);
