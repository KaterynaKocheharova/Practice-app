---
name: write-backend
description: Implement approved production NestJS backend code — services, repositories, DTOs, schemas, types, config, guards. Use only after explicit edit approval.
---

# Write Backend

Implement the approved scope with small production changes. Module layout, layering (`Controller -> Service -> Repository -> Database`), security basics, error flow, and build/test commands are in `CLAUDE.md` — this skill adds the detailed rules.

For each task, briefly state which programming/architecture pattern fits (repository for persistence, facade for orchestration, strategy for replaceable behavior, factory for creation, transaction script for one atomic flow) and use it.

Approval to implement does NOT cover Swagger or Markdown docs; don't continue into `write-swagger`/`write-docs` unless asked. Don't start `question` unless asked. Don't create spec files unless asked. Update `src/modules/index.ts` for new feature modules; add `index.ts` to a folder only when it is imported elsewhere.

## Controllers

- Group related endpoints in readable order (request then verify/confirm for one flow).
- When a guard/decorator already loaded the exact response data, return it directly instead of a duplicate lookup.

## Services

- Business rules and orchestration only; validate preconditions before writes; no Drizzle queries; request validation belongs to DTOs.
- Stay focused: when a public method has child helpers or exceeds ~3–4 meaningful operations, extract a dedicated service for that flow.
- Name multi-condition checks with small private predicates (`isStatusValid`, `isProviderValid`, `isVerificationLinkValid`, `isPasswordValid`); no dense multi-line `if`s or repeated inline comparisons. Extract named helpers for repeated/non-obvious operations (nonce generation, URL construction).
- Auth state/token helpers: prefer a small facade service over free functions; split distinct responsibilities into collaborators (e.g. encoder and decoder services) injected into the facade.
- SDK/API/library calls go behind dedicated services/providers (hashing service instead of `bcrypt` directly; mail provider; integration-specific providers for external HTTP).

## Repositories

- Drizzle queries only; inject `DatabaseConfig.DATABASE_INJECTION_TOKEN` as `NodePgDatabase`; select explicit fields only; `@HandleDatabaseError()` on async DB methods; no broad `try/catch`.
- Keep projections minimal for the use case. Before finishing, compare every selected field to the consuming method and remove unread ones.
- Reusable projections live in `constants/repository/`. Different call sites needing different fields get separate methods and projection constants — never broaden a shared one.
- Before adding a method, check whether an existing one fits exactly (projection and contract); if reuse would pull a broad entity for a narrow workflow, add a narrow method named by what it returns/looks up.
- Narrow endpoint response -> select only fields needed for validation and response. Writes that feed an internal workflow return only what that workflow needs (e.g. an `id/email/role` session-user projection, not the broad safe user).
- The same applies to response contracts: return only fields the client actually reads. Don't add "complete-looking" fields speculatively (timestamps, nested ids, MIME types, original names); check the frontend consumer when there is one.

## DTOs

Transport contracts for request/response; hide sensitive fields; validate with `class-validator` in DTOs (not services/controllers); ensure `ValidationPipe` is configured.

Cross-field request rules (a limit that depends on another field, e.g. max size by `mimeType`) also belong in the DTO, as a custom `@ValidatorConstraint` used with `@Validate(...)` (pattern: `change-password.dto.ts`), not as a service check.

## Types, enums, constants

- Avoid optional fields on interfaces and exported business types; model variants with separate named types, `Pick`, `Omit`, intersections, or discriminated unions. Optional is fine only where absence is part of the contract (partial-update DTOs, external payloads).
- Group related types by topic in `types/` (e.g. `signup.type.ts` for all sign-up responses, token payloads, job data), not one file per type. Types/interfaces live in `types/`, not inline in services/controllers.
- No inline object types on public or cross-layer method signatures — extract `<Flow>Params` / `<Flow>Result` / `<Flow>Data`. Local anonymous details private to one method may stay inline. Extract named types for repeated/noisy inline intersections (e.g. `ParsedState & { nonce: string }`).
- Drizzle contracts: prefer `typeof users.$inferInsert` / `$inferSelect`. Use explicit DTO/API/business types when the shape intentionally differs from the row; name different stages explicitly (`RawPostsData` external vs `PostsData` normalized). A workflow needing extra fields gets its own type, e.g. `Pick<UserData, 'id' | 'email'> & { mobilePhone: string }`.
- Persisted domain values (providers, roles, statuses, token purposes, queue job names) and closed cross-service flows are enums at `src/modules/<module>/enums/<name>.enum.ts`, exported from the module enum barrel (no const-object enums in type files).
- Module static config lives in ONE object at `src/modules/<module>/config.ts`, named `<moduleName>Config`, uppercase at every level: cookies, queues, job names, cleanup schedules, OAuth behavior, retry settings, DI tokens, throttle limits. No separate module constants files.

  ```ts
  export const authConfig = {
    COOKIES: { ACCESS_TOKEN: 'accessToken' },
    JOBS: { SEND_SIGNIN_VERIFICATION: 'send-signin-verification' },
    QUEUES: { EMAIL: 'auth-email' },
  } as const;
  ```

- Route-param names passed to `@Param(...)` are constants. Keep constants in the owning module unless truly cross-cutting; don't duplicate between `common` and a module. Don't extract obvious one-off literals (boolean flags, loop counters).
- Repository select constants are the exception to the config-object pattern.

## Entities and persistence

- Tables in `src/modules/<module>/schemas/schema.ts`; snake_case DB columns, camelCase TS properties; `.references(...)` for real FKs; index every FK unless a PK/unique index covers it.
- Don't store optional business subtypes as nullable columns on a broad table when the subtype has its own lifecycle, validation, uniqueness, or meaning — use a separate table (e.g. phone/contact tables, not `business_phone`/`mobile_phone`).
- Concurrent writes need an explicit strategy: pessimistic locking (`SELECT ... FOR UPDATE`, row/advisory locks in a transaction) for secure/high-contention flows; optimistic (version column, rollback handling, bounded retries, clear conflict response) for low contention.

## Security additions

- Extract dedicated Guards for role checks.
- Rate-limit unauthenticated credential endpoints (sign-in, verification, refresh, password reset) with `@Throttle`, limits/ttl in the module config object.

## Business errors

Add an `ERROR_CODE` entry plus dev/prod messages under `src/common/constants/errors/`, then throw a standard Nest exception with an `errorCode` payload.

## Readability (owner preferences)

- Do not write code comments.

- No parameter whose `null`/`undefined` value silently widens a query (e.g. `teacherId: null` meaning "all teachers"). When callers need different scopes, write separate explicit methods and let the service pick one.
- Keep the authenticated user's context in one object (`request.user`, read with `@CurrentUser()`); don't add parallel request fields such as `request.userId`.
- Create endpoints return only `{ id }` unless the owner asks for more. List/card screens and details screens get separate projections.

## Backend self-review (before finishing)

- accidental expansion into Swagger/Markdown docs;
- magic strings that should be enums/constants;
- over-broad projections, sensitive fields in general reads, unread projection fields, response fields no client reads;
- repository method duplication / wrongly reused methods;
- inline object types on public/cross-layer signatures;
- optional fields on broad types; nullable subtype columns that deserve a table;
- missing/implicit concurrency protection on high-contention or security-sensitive writes;
- missing brief statement of the chosen pattern;
- large compound conditionals that need named helpers;
- misplaced responsibilities across controller/service/repository/provider;
