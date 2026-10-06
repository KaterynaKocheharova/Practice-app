import {
  date,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { teachers } from '../../teachers/schemas/schema';
import { users } from '../../users/schemas/schema';
import { studentsConfig } from '../config';
import { Language, LanguageLevel } from '../enums';

export const languageEnum = pgEnum('language', Language);
export const languageLevelEnum = pgEnum('language_level', LanguageLevel);

export const students = pgTable(
  'students',
  {
    userId: uuid('user_id')
      .primaryKey()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdByTeacherId: uuid('created_by_teacher_id').references(
      () => teachers.userId,
      { onDelete: 'set null' },
    ),
    hobbies: text('hobbies').array(),
    job: varchar('job', { length: 255 }),
    birthDate: date('birth_date'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('students_created_by_teacher_id_idx').on(table.createdByTeacherId),
  ],
);

export const studentLanguageCourses = pgTable(
  'student_language_courses',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    studentId: uuid('student_id')
      .notNull()
      .references(() => students.userId, { onDelete: 'cascade' }),
    teacherId: uuid('teacher_id').references(() => teachers.userId, {
      onDelete: 'set null',
    }),
    language: languageEnum('language').notNull(),
    learningGoal: varchar('learning_goal', {
      length: studentsConfig.VALIDATION.LEARNING_GOAL_MAX_LENGTH,
    }),
    specialGoal: text('special_goal'),
    comments: text('comments'),
    grammarLevel: languageLevelEnum('grammar_level'),
    vocabularyLevel: languageLevelEnum('vocabulary_level'),
    speakingLevel: languageLevelEnum('speaking_level'),
    readingLevel: languageLevelEnum('reading_level'),
    listeningLevel: languageLevelEnum('listening_level'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    unique('student_language_courses_student_teacher_language_unique').on(
      table.studentId,
      table.teacherId,
      table.language,
    ),
    index('student_language_courses_teacher_id_idx').on(table.teacherId),
  ],
);
