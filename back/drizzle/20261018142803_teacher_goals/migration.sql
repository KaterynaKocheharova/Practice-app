CREATE TYPE "goal_progress_status" AS ENUM('success', 'same', 'worse');--> statement-breakpoint
CREATE TABLE "teacher_goal_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"teacher_goal_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teacher_goal_progress_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"teacher_goal_id" uuid NOT NULL,
	"attempt_number" integer NOT NULL,
	"status" "goal_progress_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "teacher_goal_progress_checks_goal_attempt_unique" UNIQUE("teacher_goal_id","attempt_number"),
	CONSTRAINT "teacher_goal_progress_checks_attempt_number_check" CHECK ("attempt_number" > 0 AND "attempt_number" % 5 = 0)
);
--> statement-breakpoint
CREATE TABLE "teacher_goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"teacher_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"details" text,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "teacher_goal_attempts_goal_id_created_at_idx" ON "teacher_goal_attempts" ("teacher_goal_id","created_at");--> statement-breakpoint
CREATE INDEX "teacher_goals_teacher_id_idx" ON "teacher_goals" ("teacher_id");--> statement-breakpoint
ALTER TABLE "teacher_goal_attempts" ADD CONSTRAINT "teacher_goal_attempts_teacher_goal_id_teacher_goals_id_fkey" FOREIGN KEY ("teacher_goal_id") REFERENCES "teacher_goals"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "teacher_goal_progress_checks" ADD CONSTRAINT "teacher_goal_progress_checks_dd5Cgqfldb6Z_fkey" FOREIGN KEY ("teacher_goal_id") REFERENCES "teacher_goals"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "teacher_goals" ADD CONSTRAINT "teacher_goals_teacher_id_teachers_user_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("user_id") ON DELETE CASCADE;