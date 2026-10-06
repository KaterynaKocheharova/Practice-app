-- Learning goal becomes free text. Every step is safe to run again.

-- Convert the column only while it still uses the enum.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'student_language_courses'
      AND column_name = 'learning_goal'
      AND udt_name = 'learning_goal'
  ) THEN
    ALTER TABLE "student_language_courses"
      ALTER COLUMN "learning_goal" SET DATA TYPE varchar(255)
      USING "learning_goal"::varchar(255);
  END IF;
END $$;--> statement-breakpoint

-- No CASCADE: if anything still used the type, fail instead of dropping it.
DROP TYPE IF EXISTS "learning_goal";--> statement-breakpoint

-- Former enum values become readable text; other values are left as they are.
UPDATE "student_language_courses"
SET "learning_goal" = CASE "learning_goal"
  WHEN 'conversation' THEN 'Conversation'
  WHEN 'grammar' THEN 'Grammar'
  WHEN 'vocabulary' THEN 'Vocabulary'
  WHEN 'pronunciation' THEN 'Pronunciation'
  WHEN 'exam_preparation' THEN 'Exam preparation'
  WHEN 'business' THEN 'Business'
  WHEN 'travel' THEN 'Travel'
  WHEN 'academic' THEN 'Academic'
  WHEN 'other' THEN 'Other'
END
WHERE "learning_goal" IN (
  'conversation',
  'grammar',
  'vocabulary',
  'pronunciation',
  'exam_preparation',
  'business',
  'travel',
  'academic',
  'other'
);
