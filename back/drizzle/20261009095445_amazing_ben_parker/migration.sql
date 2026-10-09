CREATE TYPE "media_asset_kind" AS ENUM('document', 'image', 'audio');--> statement-breakpoint
CREATE TYPE "media_asset_status" AS ENUM('pending', 'uploaded');--> statement-breakpoint
CREATE TYPE "storage_driver" AS ENUM('s3');--> statement-breakpoint
CREATE TYPE "course_document_type" AS ENUM('file', 'link');--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"provider" "storage_driver" NOT NULL,
	"storage_key" varchar(512) NOT NULL UNIQUE,
	"original_name" varchar(255) NOT NULL,
	"mime_type" varchar(255) NOT NULL,
	"size_bytes" integer NOT NULL,
	"kind" "media_asset_kind" NOT NULL,
	"status" "media_asset_status" DEFAULT 'pending'::"media_asset_status" NOT NULL,
	"uploaded_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"course_id" uuid NOT NULL,
	"type" "course_document_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"media_asset_id" uuid UNIQUE,
	"url" varchar(2048),
	"added_by_user_id" uuid,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "course_documents_type_payload" CHECK (("type" = 'file' AND "media_asset_id" IS NOT NULL AND "url" IS NULL)
        OR ("type" = 'link' AND "url" IS NOT NULL AND "media_asset_id" IS NULL))
);
--> statement-breakpoint
CREATE INDEX "media_assets_uploaded_by_user_id_idx" ON "media_assets" ("uploaded_by_user_id");--> statement-breakpoint
CREATE INDEX "media_assets_status_created_at_idx" ON "media_assets" ("status","created_at");--> statement-breakpoint
CREATE INDEX "course_documents_course_id_deleted_at_idx" ON "course_documents" ("course_id","deleted_at");--> statement-breakpoint
CREATE INDEX "course_documents_added_by_user_id_idx" ON "course_documents" ("added_by_user_id");--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_uploaded_by_user_id_users_id_fkey" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "course_documents" ADD CONSTRAINT "course_documents_course_id_student_language_courses_id_fkey" FOREIGN KEY ("course_id") REFERENCES "student_language_courses"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "course_documents" ADD CONSTRAINT "course_documents_media_asset_id_media_assets_id_fkey" FOREIGN KEY ("media_asset_id") REFERENCES "media_assets"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "course_documents" ADD CONSTRAINT "course_documents_added_by_user_id_users_id_fkey" FOREIGN KEY ("added_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL;