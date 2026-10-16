ALTER TYPE "user_status" ADD VALUE 'onboarding';--> statement-breakpoint
DROP TABLE "verification_links";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "password_hash";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "auth_provider";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
DROP TYPE "verification_link_purpose";