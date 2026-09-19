# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # next dev (http://localhost:3000)
npm run build        # next build — run when touching src/app, providers, next.config.ts
npm run lint         # eslint
npx tsc --noEmit     # type check (no separate script)
```

There is no test runner configured. On Windows PowerShell, `npm.cmd` / `npx.cmd` may be needed (the skills use those forms).

Next.js 16 / React 19 / Tailwind 4: APIs differ from older versions, so read `node_modules/next/dist/docs/` before writing Next-specific code (see AGENTS.md).

## Environment

`NEXT_PUBLIC_API_URL` points at the NestJS backend in `../back` (`http://localhost:3001` in `.env.example`; note the backend's default port is 3005 unless `PORT` is set). If unset, the client falls back to same-origin paths, but server-side helpers deliberately return "unauthenticated" instead (to avoid recursively calling the Next app).

## Architecture

This repo is the `front/` half of a monorepo; `../back` is a separate nested git repo. The repo is driven by the owner's workflow skills in `.agents/skills/` (`analyze-task` → owner approval → `write-frontend` → `write-docs`). Do not edit files until the user explicitly asks; follow AGENTS.md's gates. `src/docs/` (api-requests, design-system, frontend-structure) documents the implemented behavior — check it before changing auth/API flows.

**Layering** (UI → hook → module API fn → common client → backend):
- `src/app` is thin: route files only compose module components. Providers live in `src/app/providers` (React Query, toaster).
- `src/modules/<name>/` holds feature code (`auth` is the only real module; `module-name` is a template). `src/modules/common/` holds shared components, constants, API client, utils.
- Client orchestration (mutations, queries, cache + Zustand updates) lives in module `hooks/`. The `actions/` folders are reserved for real `"use server"` functions.
- `common/api/api-client.ts`: `apiRequest`/`apiJsonRequest` use `credentials: "include"` and, on a 401, do a single shared-promise `POST /auth/refresh` then retry once (`skipAuthRefresh` opts out). Errors are normalized to `ApiError`.
- Auth uses HttpOnly cookies set by the backend (passwordless email verification flows: sign-up/sign-in → verify → `/users/me`). Zustand auth store holds only UI-safe state — never tokens. Server components get the session via `auth/api/current-user-server.ts` (`server-only`, forwards request cookies, fails soft to `null`).

**Conventions enforced by `write-frontend` skill** (read `.agents/skills/write-frontend/SKILL.md` for the full list):
- One folder per component containing `<name>.tsx`, `types.ts` (props — never inline), and `style.ts` (Tailwind class strings as a camelCase object, e.g. `signInFormStyles`).
- Arrow-function components; barrel `index.ts` files only where needed.
- No magic strings: use `TEXTS`, `ERRORS`, `APP_ROUTES`, `API_ROUTES`, and per-module `<MODULE>_CONFIG` objects (UPPER_SNAKE_CASE). Enums live in `<module>.enums.ts` only.
- Zustand hooks must select only the fields they return, never the whole store.
- Never show raw backend error text for auth failures; use frontend-owned `ERRORS` messages (prevents account-enumeration leaks).
- Generic components stay feature-agnostic; feature hooks/messages/toasts go in intent-specific wrappers (e.g. `SignInVerificationStatus` wrapping generic `Verification`).
- Pages compose `Section` + `Container` from `common/components`; theme via CSS variables in `src/app/globals.css`.
- Import alias: `@/` → `src/`.
