---
name: write-backend
description: Implement production NestJS backend code.
---

# Backend Skill

# Core Mission

Implement the approved backend scope with small production changes.

Follow `AGENTS.md` for global workflow, search discipline, project structure, import/barrel rules, naming, and validation defaults.

This skill contains backend implementation details only.

Backend approval does not imply approval for Swagger, OpenAPI, or Markdown docs.
Do not continue into `write-swagger` or `write-docs` unless the human owner
explicitly asks for those workflows.

---

# Module Rules

Use the feature module structure from `AGENTS.md`.

Create only folders needed by the task. Add `index.ts` when a folder is imported from elsewhere.

Update `src/modules/index.ts` when adding a feature module that should be imported by `AppModule` or another module.

Do not create spec files unless explicitly requested.

---

# Layer Rules

Use this direction:

```txt
Controller -> Service -> Repository -> Database
```

Controllers must:

- act as HTTP entrypoints;
- delegate work to services;
- avoid business and persistence logic.

Services must:

- contain business rules and orchestration;
- coordinate repositories;
- validate business preconditions before writes;
- avoid Drizzle queries;
- delegate request validation to DTOs when DTOs exist.
- stay focused: when a public method has child/helper methods or grows beyond three to four meaningful operations, extract a dedicated service for that flow and move the child/helper methods there.
- avoid large compound business checks when separate predicates would make intent clearer; extract focused private helpers such as `isStatusValid`, `isProviderValid`, or `isPasswordValid` for multi-condition auth and eligibility checks.

SDK, API, and library calls must be abstracted behind dedicated services or providers.

Examples:

- use a hashing service instead of calling `bcrypt` directly in feature services;
- use a mail provider/service instead of calling an external mail API directly;
- use an integration-specific provider/service for external HTTP APIs.

---

# Repository Rules

Repositories must:

- contain Drizzle queries;
- inject `DatabaseConfig.DATABASE_INJECTION_TOKEN`;
- use `NodePgDatabase`;
- select explicit fields only;
- keep select projections minimal for the current use case; recheck new projection constants against downstream usage and remove fields that are only needed by later, separate reads.
- keep reusable select projections in `constants/repository`;
- decorate async DB methods with `@HandleDatabaseError()`;
- avoid broad `try/catch`.

---

# DTO Rules

DTOs must:

- define request and response transport contracts;
- hide sensitive fields;
- perform validation with `class-validator` decorators;
- keep validation in DTOs rather than services or controllers;
- ensure Nest `ValidationPipe` is configured when request DTO validation is introduced.

---

# Type, Interface, Enum, And Constant Rules

Use clear and consistent names for data shapes.

Do not create a separate file for every module type or interface. Group related types by topic.

Example:

```txt
src/modules/auth/types/signup.type.ts
```

Use a topic file like `signup.type.ts` for all sign-up-related types, such as response types, token payload types, and queue job data types.

For Drizzle repository insert/select contracts, prefer inferred schema types:

```ts
export type CreateUserData = typeof users.$inferInsert;
export type UserData = typeof users.$inferSelect;
```

Use explicit DTO classes, API response types, and business-specific types when the shape intentionally differs from the database row.

When two shapes represent different stages of the same data, name that difference explicitly.

Example:

```ts
interface RawPostsData {
  // External API shape.
}

interface PostsData {
  // Normalized internal shape.
}
```

Avoid magic strings and magic numbers, resort to constants and enums.
Use enums or constants for persisted domain values such as auth providers,
roles, statuses, token purposes, and queue job names.

Do not extract obvious one-off literal values that are clearer inline, such as simple boolean flags or local loop counters.

Module repository select constants live under:

```txt
src/modules/<module-name>/constants/repository/
```

Common error codes/messages live under `src/common/constants/errors/`.

---

# Entity And Persistence Rules

When persistence is involved:

- place tables in `src/modules/<module-name>/schemas/schema.ts`;
- use snake_case database column names;
- use camelCase TypeScript schema properties when needed;
- use `.references(...)` for real database foreign keys;
- always index foreign keys unless a primary key or unique index already covers the column.

---

# Security Rules

- keep safe error messages;
- preserve user or tenant data isolation;
- avoid logging sensitive information;
- always ask for authorization, rbac, or abac clarification if not stated by task;
- extract dedicated Guards for roles checks;

---

# Error Handling Rules

Use this flow for database operations:

```txt
Repository method
-> @HandleDatabaseError()
-> DatabaseErrorMapper
-> HttpException with errorCode
-> GlobalExceptionFilter
-> dev/prod message mapper
-> unified API error response
```

When implementation introduces a business error, add an `ERROR_CODE` entry and dev/prod messages under `src/common/constants/errors/`, then throw a standard NestJS exception with an `errorCode` payload.

---

# Backend Self-Review

Before finishing, review the changed backend code for:

- accidental expansion into Swagger or Markdown docs without explicit owner request;
- magic strings that should be enums or constants;
- over-broad repository projections or sensitive fields exposed through general reads;
- large compound conditionals that should be named helper methods;
- misplaced responsibilities across controller, service, repository, and provider boundaries;

---
