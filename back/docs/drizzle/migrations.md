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