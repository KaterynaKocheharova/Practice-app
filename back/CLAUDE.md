# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

NestJS 11 backend (Drizzle ORM + PostgreSQL, BullMQ/Redis, JWT auth). This is a nested git repo inside a larger monorepo whose sibling `../front/` is the Next.js frontend. `AGENTS.md` and `.agents/skills/` hold the owner's Codex workflow rules; the parts that matter are summarized below.

## Commands

```bash
docker compose up -d db        # local Postgres 18 (myuser/mypassword/mydb on :5432); Redis is not in compose
npm run start:dev              # watch mode, default port 3005 (PORT env overrides)
npm run build                  # nest build
npm run lint                   # eslint --fix over src/apps/libs/test
npm run format                 # prettier

npm test -- <module-or-file>   # unit tests (jest, rootDir=src, *.spec.ts) — run targeted, not the full suite
npm run test:e2e               # test/jest-e2e.json

npm run db:generate            # drizzle-kit generate (after editing a schema)
npm run db:migrate             # apply migrations (review generated SQL in drizzle/ first)
npm run db:push
```

Env vars are read from `.env` (see `docs/env.md` for the full list and a local example): database, Redis, SMTP/Resend, JWT secrets/expiries, Google OAuth, `FRONTEND_URL`.

## Workflow rules (from AGENTS.md)

- New task prompts go through the `analyze-task` skill first; when a prompt says "use analyze-task skill", output only the analysis and **stop for explicit owner approval** before implementing. Skip only if told "Skip analyze-task for this request."
- Default flow: analyze-task → approval → `write-backend` → `write-swagger` → `write-docs`. Skill definitions live in `.agents/skills/<name>/SKILL.md`.
- After production code changes: run `npm run build` and only the relevant existing tests, not the full suite.
- Reviews (`do-review`): ask whether scope is the whole project or one feature first; check security, SOLID architecture, pattern use, overengineering, and `write-backend` adherence.
- Don't crawl unrelated folders; stop searching once there's enough context.

## Architecture

- `src/main.ts` — global `ValidationPipe` (`whitelist` + `forbidNonWhitelisted` + `transform`), CORS restricted to `FRONTEND_URL` with credentials, Swagger at the path in `src/constant/swagger`.
- `src/app.module.ts` — global `ThrottlerGuard` (defaults in `common/constants/throttle.constant.ts`), `ConfigModule` global, wires `DatabaseModule`, `QueueModule`, `CommonModule` and feature modules.
- `src/modules/` — feature modules (`auth`, `mail`, `users`, `students`, `teachers`), imported only via the barrel `src/modules/index.ts`. Layering is strictly `Controller -> Service -> Repository -> Database`; controllers stay thin, DTOs in `dto/`, Drizzle tables in `schemas/schema.ts` (drizzle config globs `./src/**/schema.ts`). Avoid circular deps and deep cross-module imports.
- `src/common/` — shared infrastructure: typed env config (`configs/env-config*.ts`, zod-validated), `jwt`, `hashing`, `auth` (guards/decorators), `constants` (routes, error codes, messages), `filters/global-exception.filter.ts`.
- `src/database/` — `DatabaseModule` provides the Drizzle `node-postgres` instance under `DatabaseConfig.DATABASE_INJECTION_TOKEN`.

### Cross-cutting flows (span several files)

- **Errors:** repositories are decorated with `@HandleDatabaseError()`, which routes raw Postgres errors through `DatabaseErrorMapper` into `HttpException`s carrying an `errorCode`; `GlobalExceptionFilter` then formats every error into one response shape (`success, statusCode, errorCode, message, path, timestamp, details?`), using safe messages in production and dev messages otherwise. See `docs/error-handling/error-flow.md`.
- **Queues:** BullMQ with one global Redis connection and per-feature queues. Queue/job names live in each module's `config.ts`; each feature has a queue service (`@InjectQueue`, enqueue methods) and a `WorkerHost` processor. `mail` is the reference implementation (`docs/queue.md`). Only export the queue service from the module.
- **Auth:** the `auth` module is split into one service per flow (signup, verify-signup, signin, verify-signin, refresh, logout, change-password, google-oauth) plus token/session services; signup/signin use email verification via the mail queue, and Google OAuth uses a signed state token. Flow docs are in `docs/auth/`.

## Docs

`docs/` is maintained per feature (auth flows, db setup/entities/migrations, env, queue, error handling); update the relevant file when changing behavior (the `write-docs` step). Note `README.md` is still the stock Nest starter.
