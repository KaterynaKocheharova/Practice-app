import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { teachers } from '../../teachers/schemas/schema';
import { users } from '../../users/schemas/schema';
import { LearningGoal } from '../enums';

export const learningGoalEnum = pgEnum('learning_goal', LearningGoal);

export const students = pgTable(
  'students',
  {
    userId: uuid('user_id')
      .primaryKey()
      .references(() => users.id, { onDelete: 'cascade' }),
    teacherId: uuid('teacher_id').references(() => teachers.userId, {
      onDelete: 'set null',
    }),
    hobbies: text('hobbies').array().notNull(),
    learningGoal: learningGoalEnum('learning_goal').notNull(),
    specialGoal: text('special_goal'),
    job: varchar('job', { length: 255 }).notNull(),
    age: integer('age').notNull(),
  },
  (table) => [index('students_teacher_id_idx').on(table.teacherId)],
);
