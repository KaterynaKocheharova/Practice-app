-- Learning goal is an enum again; any custom goal belongs in special_goal.
-- Reverts 20261006204034_learning_goal_to_text. Every step is safe to run again.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'learning_goal') THEN
    CREATE TYPE "learning_goal" AS ENUM('conversation', 'grammar', 'vocabulary', 'pronunciation', 'exam_preparation', 'business', 'travel', 'academic', 'other');
  END IF;
END $$;--> statement-breakpoint

-- Convert only while the column is still text.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'student_language_courses'
      AND column_name = 'learning_goal'
      AND udt_name = 'varchar'
  ) THEN
    -- Keep free-text goals that are not enum values by moving them into special_goal.
    UPDATE "student_language_courses"
    SET
      "special_goal" = CASE
        WHEN "special_goal" IS NULL OR "special_goal" = '' THEN "learning_goal"
        ELSE "learning_goal" || E'\n' || "special_goal"
      END,
      "learning_goal" = NULL
    WHERE "learning_goal" IS NOT NULL
      AND lower(replace(trim("learning_goal"), ' ', '_')) NOT IN (
        'conversation', 'grammar', 'vocabulary', 'pronunciation',
        'exam_preparation', 'business', 'travel', 'academic', 'other'
      );

    -- Readable values ('Exam preparation') and enum values ('exam_preparation') both map back.
    ALTER TABLE "student_language_courses"
      ALTER COLUMN "learning_goal" SET DATA TYPE "learning_goal"
      USING lower(replace(trim("learning_goal"), ' ', '_'))::"learning_goal";
  END IF;
END $$;
