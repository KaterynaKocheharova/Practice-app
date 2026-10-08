-- A course can have several learning goals (at least one).
-- Existing single goals carry over; courses without a goal get 'other'.

ALTER TABLE "student_language_courses" ADD COLUMN "learning_goals" "learning_goal"[];--> statement-breakpoint

UPDATE "student_language_courses"
SET "learning_goals" = ARRAY[COALESCE("learning_goal", 'other')]::"learning_goal"[];--> statement-breakpoint

ALTER TABLE "student_language_courses" ALTER COLUMN "learning_goals" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "student_language_courses" DROP COLUMN "learning_goal";--> statement-breakpoint
ALTER TABLE "student_language_courses" ADD CONSTRAINT "student_language_courses_learning_goals_not_empty" CHECK (cardinality("learning_goals") >= 1);
