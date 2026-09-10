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

After implementation, mention `question` only when the owner asks to be quizzed
or when a short understanding check would be a useful optional next workflow.
Do not start the `question` workflow unless the owner explicitly requests it.

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
- keep related endpoint methods grouped in a readable order, such as request
  then verify/confirm for the same flow, before moving to the next flow.
- when a guard or decorator has already loaded the exact response data, return
  that data directly instead of performing a duplicate service/repository lookup.

Services must:

- contain business rules and orchestration;
- coordinate repositories;
- validate business preconditions before writes;
- avoid Drizzle queries;
- delegate request validation to DTOs when DTOs exist.
- stay focused: when a public method has child/helper methods or grows beyond three to four meaningful operations, extract a dedicated service for that flow and move the child/helper methods there.
- avoid large compound business checks when separate predicates would make intent clearer; extract focused private helpers such as `isStatusValid`, `isProviderValid`, `isVerificationLinkValid`, or `isPasswordValid` for multi-condition auth and eligibility checks.
- keep public orchestration methods readable: do not leave dense multi-line `if` conditions or repeated inline comparisons when small private predicates can name the rule directly.
- extract named private helpers for repeated or non-obvious local operations, such as nonce generation or URL construction. 
- For auth state/token helpers, prefer a small facade service over free functions when the rest of the module is class/provider based. If the facade has distinct responsibilities, split them into focused collaborator services, such as separate encoder and decoder services, and inject them into the facade.

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
- keep select projections minimal for the current use case; recheck new projection constants against downstream usage and remove fields that are unused or only needed by later, separate reads.
- before finishing a new projection, compare every selected field against the service or repository method that consumes it. Remove fields that are not read, even if they are harmless.
- create separate repository methods and projection constants when different
  call sites need different field sets; do not broaden a shared projection just
  because another flow needs extra fields.
- before adding a repository method, check whether an existing method can be reused without selecting unused fields or weakening the method contract. If reuse would pull a broad entity for a narrow workflow, add a distinct narrow method instead and name it by the data it returns or the lookup it performs.
- when an endpoint returns a narrow response shape, prefer selecting only the
  fields needed for validation and response instead of selecting a broad safe
  entity and trimming it later.
- for write operations that immediately feed another internal workflow, return only the fields needed by that workflow. For example, if a create/update only needs to create auth session tokens, return an `id/email/role` session-user projection instead of the broad safe user projection.
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
Use enums for closed backend domain flows when values are compared across services or encoded into state. Put module-owned enums in `src/modules/<module-name>/enums/<name>.enum.ts` and export them from the module enum barrel instead of declaring const-object enums inside type files.
Group related literal configuration in a module-owned config or constants file when several values define one behavior, such as OAuth scopes, state TTLs, success paths, or retry settings. Prefer a single exported object when those values are consumed together.
Group related job names for the same module in one module-owned job constants file/object instead of creating separate job-name files per queue or processor.
Use constants for route parameter names when they are passed to decorators such
as `@Param(...)`.
Keep constants in the module that owns the domain concept unless they are truly
cross-cutting; avoid duplicating equivalent constants across `common` and a
feature module.

Do not extract obvious one-off literal values that are clearer inline, such as simple boolean flags or local loop counters.

Interfaces and exported business-specific type shapes belong in the module's
`types/` files, not inline inside services or controllers. Do not leave inline
object parameter types on public service methods or cross-layer method
contracts; extract a named interface such as `<Flow>Params`, `<Flow>Result`, or
`<Flow>Data`. Local anonymous implementation details may stay inline only when
they are private to one method and not part of a method contract or shared
behavior.
Avoid repeated or visually noisy inline intersections in type guards, such as `ParsedState & { nonce: string }`; extract a named intermediate type in the relevant `types/` file when the shape is used in more than one signature or clarifies validation stages.

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
- projection constants with fields that are not read by the consuming workflow;
- repository method duplication: existing methods should be reused only when their projection and contract fit the workflow exactly; otherwise the narrow method should have a clearly distinct return shape and name;
- inline object types on public or cross-layer method signatures that should be named module types;
- large compound conditionals or repeated inline comparisons that should be named helper methods;
- misplaced responsibilities across controller, service, repository, and provider boundaries;

---
