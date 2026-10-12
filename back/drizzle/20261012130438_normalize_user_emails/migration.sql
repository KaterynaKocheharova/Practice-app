-- Emails are now stored lowercased. If two accounts differ only by case, this
-- UPDATE fails on the email unique constraint: merge or rename them by hand first.
UPDATE "users"
SET "email" = lower(trim("email"))
WHERE "email" IS NOT NULL AND "email" <> lower(trim("email"));
--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_lower_unique" ON "users" (lower("email"));
