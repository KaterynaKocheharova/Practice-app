---
name: write-backend
description: Implement production NestJS backend code.
---

# Backend Skill

# Core Mission

Implement the approved backend scope with small production changes.

Follow `AGENTS.md` for global workflow, search discipline, project structure, import/barrel rules, naming, and validation defaults.

This skill contains backend implementation details only.

For each implementation task, explicitly explain which programming pattern or
architecture pattern best fits the problem, then use that pattern in the code.
Keep the explanation brief and specific, such as repository pattern for
persistence access, facade for orchestration over collaborators, strategy for
replaceable behavior, factory for object creation, or transaction script for a
single atomic business flow.

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
- keep cross-field request rules (a limit that depends on another field, e.g. max size by `mimeType`) in the DTO too, as a custom `@ValidatorConstraint` used with `@Validate(...)` (pattern: `change-password.dto.ts`), not as a service check;
- ensure Nest `ValidationPipe` is configured when request DTO validation is introduced.

---

# Type, Interface, Enum, And Constant Rules

Use clear and consistent names for data shapes.

Avoid optional fields in interfaces and exported business-specific types. When
a field is present only for some use cases, model that case with a separate
named type, `Pick`, `Omit`, intersection, discriminated union, or another
explicit shape instead of making the field optional on a broad shared type.
Use optional properties only for truly optional input semantics where absence is
part of the contract, such as partial update DTOs or external API payloads.

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

When one workflow needs extra fields, create a separate type that names that
workflow instead of widening the base type with optional properties. Prefer
focused derived shapes such as:

```ts
type UserContactData = Pick<UserData, 'id' | 'email'> & {
  mobilePhone: string;
};
```

Avoid magic strings and magic numbers, resort to module config objects,
repository select constants, shared constants, or enums.
Use enums or constants for persisted domain values such as auth providers,
roles, statuses, token purposes, and queue job names.
Use enums for closed backend domain flows when values are compared across services or encoded into state. Put module-owned enums in `src/modules/<module-name>/enums/<name>.enum.ts` and export them from the module enum barrel instead of declaring const-object enums inside type files.
Place module-owned static configuration in one module config object at
`src/modules/<module-name>/config.ts`.
Name it `<moduleName>Config` and group related values under uppercase nested
properties.

Example:

```ts
export const authConfig = {
  COOKIES: {
    ACCESS_TOKEN: 'accessToken',
  },
  JOBS: {
    SEND_SIGNIN_VERIFICATION: 'send-signin-verification',
  },
  QUEUES: {
    EMAIL: 'auth-email',
  },
  GOOGLE_OAUTH: {
    SCOPES: ['openid', 'email', 'profile'],
  },
} as const;
```

Use this module config pattern for module-owned cookies, queues, job names,
cleanup schedules, OAuth behavior, retry settings, module DI tokens, and other similiar things.
Do not create separate module-level constants files for those values.
Keep static config values uppercase at every object level, such as
`authConfig.COOKIES.ACCESS_TOKEN` or `mailConfig.JOBS.SEND_EMAIL`.
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

Repository select constants are the module-level exception to the config object
pattern because repository projections are intentionally grouped with
repository data-access concerns.

Common error codes/messages live under `src/common/constants/errors/`.

---

# Entity And Persistence Rules

When persistence is involved:

- place tables in `src/modules/<module-name>/schemas/schema.ts`;
- use snake_case database column names;
- use camelCase TypeScript schema properties when needed;
- use `.references(...)` for real database foreign keys;
- always index foreign keys unless a primary key or unique index already covers the column.
- avoid storing optional business subtypes as nullable columns on a broad table
  when the subtype has its own lifecycle, validation, uniqueness, or meaning.
  Model those cases with separate tables instead. For example, prefer dedicated
  phone/contact tables over optional `business_phone` and `mobile_phone`
  columns on the main entity when those phone types are independent contact
  records.
- for concurrent writes, choose an explicit concurrency prevention strategy:
  use pessimistic locking for secure or high-contention flows that must prevent
  conflicting access, such as `SELECT ... FOR UPDATE`, row locks, or advisory
  locks inside a transaction; use optimistic concurrency for lower-contention
  flows with a version column, rollback handling, bounded retries, and a clear
  conflict response.

---

# Security Rules

- keep safe error messages;
- preserve user or tenant data isolation;
- avoid logging sensitive information;
- always ask for authorization, rbac, or abac clarification if not stated by task;
- extract dedicated Guards for roles checks;
- put resource access and ownership preconditions that decide `404`/`403` before an action in a dedicated guard plus an access service method (pattern: `StudentEditGuard` → `StudentAccessService.ensureStudentIsEditable()`); the service keeps only the atomic write condition (e.g. `WHERE added_by_user_id = caller`) and the race-condition `404`;
- before adding a guard to routes, check which guards already run there; do not stack a guard that a stricter one already implies;
- apply rate limiting (`@nestjs/throttler`, via `@Throttle` on the route) to unauthenticated credential endpoints such as sign-in, verification, refresh, and password reset; keep the limit/ttl values in the module config object, not inline literals;
- mirror security-relevant client-side validation, such as password complexity, in the backend DTO; never rely on frontend validation alone for a rule that protects the system;

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

# Readability Rules (Owner Preferences)

- do not write code comments;
- prefer plain built-in Drizzle operators (`eq`, `ilike`, `inArray`, `and`, `or`) over clever custom helpers or raw `sql` snippets; accept a harmless quirk (e.g. `%` acting as a wildcard in a search the caller can only run on their own data) rather than adding code the owner has to study;
- keep each repository method's `where` readable in place; do not move query conditions into generic private "filter"/"scope" helpers — a private helper is fine only for a named domain rule reused across methods (e.g. `belongsToTeacher`);
- do not add parameters whose `null`/`undefined` value silently widens a query (e.g. `teacherId: null` meaning "all teachers"); when callers need different scopes, write separate explicit methods and let the service pick one;
- prefer non-correlated `inArray(column, subquery)` over correlated `exists(...)` when both give the same result;
- avoid TypeScript type predicates (`x is T`); narrow by returning a typed value (e.g. `getAuthenticatedUser(): T | undefined`) or by reusing a value already proven equal (e.g. `payload.email` after comparing it with `user.email`);
- keep the authenticated user's context in one object (`request.user`, read with `@CurrentUser()`); do not add parallel request fields such as `request.userId`;
- create endpoints return only `{ id }` unless the owner asks for more; list/card screens and details screens get separate projections.
- response contracts contain only fields the client actually reads; do not add "complete-looking" fields speculatively (timestamps, nested ids, MIME types, original names); check the frontend consumer when there is one;
- when a response only restructures joined columns, shape it in the Drizzle select (nested objects; a nested object whose columns all come from one left-joined table becomes `null` when nothing joined) instead of a hand-written row-to-response mapper; keep viewer-dependent values (e.g. `canDelete`) in the service.

---

# Backend Self-Review

Before finishing, review the changed backend code for:

- accidental expansion into Swagger or Markdown docs without explicit owner request;
- magic strings that should be enums or constants;
- over-broad repository projections or sensitive fields exposed through general reads;
- projection constants with fields that are not read by the consuming workflow;
- repository method duplication: existing methods should be reused only when their projection and contract fit the workflow exactly; otherwise the narrow method should have a clearly distinct return shape and name;
- inline object types on public or cross-layer method signatures that should be named module types;
- optional fields on broad interfaces/types that should be modeled as separate
  shapes with `Pick`, `Omit`, intersections, discriminated unions, or focused
  named types;
- optional business subtype data stored as nullable columns when a separate
  table would better represent lifecycle, validation, or concurrency needs;
- missing or implicit concurrency protection around high-contention or
  security-sensitive writes;
- missing brief explanation of the programming pattern selected for the task;
- large compound conditionals or repeated inline comparisons that should be named helper methods;
- misplaced responsibilities across controller, service, repository, and provider boundaries;
- breaks of the readability rules above (clever helpers, hidden `where` clauses, null-widened queries, type predicates);

---
