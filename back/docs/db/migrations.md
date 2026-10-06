## Migrations

Ensure the migration config is in place before generating or running migrations. The config should include:

- `schema`: path to the Drizzle schema files.
- `out`: folder where generated migrations should be stored.
- `dialect`: database dialect, for example `postgresql`.
- `dbCredentials.url`: database connection string.

After you update a schema, generate a new migration:

```bash
npx drizzle-kit generate
```

Review the generated SQL under the migration output folder before applying it.

Run pending migrations:

```bash
npx drizzle-kit migrate
```

Alternative custom command added to the project:
```bash
npm run db:generate
npm run db:migrate
```

## Writing Safe Migrations

`drizzle-kit migrate` runs all pending migrations in one transaction: if a statement fails, nothing is applied or recorded. Each migration still runs only once per database, so a committed migration is never edited; fix it with a new one.

When a generated migration changes existing data or types, rewrite it so it is safe to run again and does not lose data:

- Guard type changes on the current state (`DO $$ ... IF EXISTS (SELECT 1 FROM information_schema.columns WHERE ... udt_name = ...)`), and use `CREATE TYPE` only if it does not exist and `DROP TYPE IF EXISTS` (no `CASCADE`).
- Convert values explicitly in `USING`; a plain cast fails on values outside the target enum.
- Move values that do not fit the new type instead of dropping them.
- Dry-run before applying: `BEGIN;`, the migration SQL twice, `ROLLBACK;`, through `docker compose exec -T db psql`.
- Deploy order: run the migration, then the backend, then the frontend.

Example: `20261006204034_learning_goal_to_text` made `learning_goal` free text, and `20261006215851_learning_goal_to_enum` reverts it. The revert maps readable values (`Exam preparation`) back to the enum (`exam_preparation`) and moves other free text into `special_goal`.