CREATE TYPE "verification_link_purpose" AS ENUM('VERIFY_SIGNIN', 'VERIFY_SIGNUP');--> statement-breakpoint
CREATE TABLE "verification_links" (
	"id" uuid PRIMARY KEY,
	"user_id" uuid NOT NULL,
	"email" text NOT NULL,
	"purpose" "verification_link_purpose" NOT NULL,
	"hashed_token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "verification_links_user_id_purpose_idx" ON "verification_links" ("user_id","purpose");--> statement-breakpoint
CREATE INDEX "verification_links_expires_at_idx" ON "verification_links" ("expires_at");--> statement-breakpoint
ALTER TABLE "verification_links" ADD CONSTRAINT "verification_links_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;