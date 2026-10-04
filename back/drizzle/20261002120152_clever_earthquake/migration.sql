CREATE TYPE "language" AS ENUM('english', 'german', 'french', 'spanish', 'italian', 'polish', 'ukrainian', 'chinese');--> statement-breakpoint
CREATE TYPE "language_level" AS ENUM('a0', 'a1', 'a1_plus', 'a2', 'a2_plus', 'b1', 'b1_plus', 'b2', 'b2_plus', 'c1', 'c1_plus', 'c2');--> statement-breakpoint
ALTER TYPE "user_status" ADD VALUE 'managed';--> statement-breakpoint
CREATE TABLE "student_language_courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"student_id" uuid NOT NULL,
	"teacher_id" uuid,
	"language" "language" NOT NULL,
	"learning_goal" "learning_goal",
	"special_goal" text,
	"comments" text,
	"grammar_level" "language_level",
	"vocabulary_level" "language_level",
	"speaking_level" "language_level",
	"reading_level" "language_level",
	"listening_level" "language_level",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "student_language_courses_student_teacher_language_unique" UNIQUE("student_id","teacher_id","language")
);
--> statement-breakpoint
ALTER TABLE "students" DROP CONSTRAINT "students_teacher_id_teachers_user_id_fkey";--> statement-breakpoint
DROP INDEX "students_teacher_id_idx";--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "created_by_teacher_id" uuid;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "birth_date" date;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "students" DROP COLUMN "teacher_id";--> statement-breakpoint
ALTER TABLE "students" DROP COLUMN "learning_goal";--> statement-breakpoint
ALTER TABLE "students" DROP COLUMN "special_goal";--> statement-breakpoint
ALTER TABLE "students" DROP COLUMN "age";--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "hobbies" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "job" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
CREATE INDEX "student_language_courses_teacher_id_idx" ON "student_language_courses" ("teacher_id");--> statement-breakpoint
CREATE INDEX "students_created_by_teacher_id_idx" ON "students" ("created_by_teacher_id");--> statement-breakpoint
ALTER TABLE "student_language_courses" ADD CONSTRAINT "student_language_courses_student_id_students_user_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("user_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "student_language_courses" ADD CONSTRAINT "student_language_courses_teacher_id_teachers_user_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("user_id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_created_by_teacher_id_teachers_user_id_fkey" FOREIGN KEY ("created_by_teacher_id") REFERENCES "teachers"("user_id") ON DELETE SET NULL;