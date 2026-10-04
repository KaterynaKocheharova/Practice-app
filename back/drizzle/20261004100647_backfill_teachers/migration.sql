-- Teachers who signed up before teacher profiles were created on activation.
INSERT INTO "teachers" ("user_id")
SELECT "id" FROM "users"
WHERE "role" = 'teacher' AND "status" = 'active'
ON CONFLICT DO NOTHING;
