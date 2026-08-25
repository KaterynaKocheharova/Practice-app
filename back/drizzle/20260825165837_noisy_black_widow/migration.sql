CREATE TYPE "learning_goal" AS ENUM('conversation', 'grammar', 'vocabulary', 'pronunciation', 'exam_preparation', 'business', 'travel', 'academic', 'other');--> statement-breakpoint
CREATE TABLE "students" (
	"user_id" uuid PRIMARY KEY,
	"teacher_id" uuid,
	"hobbies" text[] NOT NULL,
	"learning_goal" "learning_goal" NOT NULL,
	"special_goal" text,
	"job" varchar(255) NOT NULL,
	"age" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"user_id" uuid PRIMARY KEY
);
--> statement-breakpoint
CREATE INDEX "students_teacher_id_idx" ON "students" ("teacher_id");--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_teacher_id_teachers_user_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("user_id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;