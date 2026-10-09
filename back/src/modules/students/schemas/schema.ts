import { sql } from 'drizzle-orm';
import {
  check,
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

import { mediaAssets } from '../../media-assets/schemas/schema';
import { teachers } from '../../teachers/schemas/schema';
import { users } from '../../users/schemas/schema';
import { studentsConfig } from '../config';
import {
  CourseDocumentType,
  Language,
  LanguageLevel,
  LearningGoal,
} from '../enums';

export const courseDocumentTypeEnum = pgEnum(
  'course_document_type',
  CourseDocumentType,
);
export const learningGoalEnum = pgEnum('learning_goal', LearningGoal);
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
    learningGoals: learningGoalEnum('learning_goals').array().notNull(),
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
    check(
      'student_language_courses_learning_goals_not_empty',
      sql`cardinality(${table.learningGoals}) >= 1`,
    ),
  ],
);

/**
 * Files and links attached to a course. A `file` row points at a media asset
 * (deleting the asset deletes the row); a `link` row stores an https URL.
 * `deletedAt` hides a row until the purge job removes it for good.
 */
export const courseDocuments = pgTable(
  'course_documents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    courseId: uuid('course_id')
      .notNull()
      .references(() => studentLanguageCourses.id, { onDelete: 'cascade' }),
    type: courseDocumentTypeEnum('type').notNull(),
    title: varchar('title', {
      length: studentsConfig.VALIDATION.DOCUMENT_TITLE_MAX_LENGTH,
    }).notNull(),
    mediaAssetId: uuid('media_asset_id')
      .unique()
      .references(() => mediaAssets.id, { onDelete: 'cascade' }),
    url: varchar('url', {
      length: studentsConfig.VALIDATION.DOCUMENT_URL_MAX_LENGTH,
    }),
    addedByUserId: uuid('added_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('course_documents_course_id_deleted_at_idx').on(
      table.courseId,
      table.deletedAt,
    ),
    index('course_documents_added_by_user_id_idx').on(table.addedByUserId),
    check(
      'course_documents_type_payload',
      sql`(${table.type} = 'file' AND ${table.mediaAssetId} IS NOT NULL AND ${table.url} IS NULL)
        OR (${table.type} = 'link' AND ${table.url} IS NOT NULL AND ${table.mediaAssetId} IS NULL)`,
    ),
  ],
);
