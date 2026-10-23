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

`API_URL` (server-only) points at the NestJS backend in `../back` (`http://localhost:3005` in `.env.example`). The browser never calls the backend — in production the two run on different sites (Vercel / Render), so every request goes through this Next app. If `API_URL` is unset, server helpers fail soft ("unauthenticated" / load error).

## Architecture

This repo is the `front/` half of a monorepo; `../back` is a separate nested git repo. The repo is driven by the owner's workflow skills in `.agents/skills/` (`analyze-task` → owner approval → `write-frontend` → `write-docs`). Do not edit files until the user explicitly asks; follow AGENTS.md's gates. `src/docs/` documents the implemented behavior (`architecture/`: api-requests, design-system, frontend-structure, role-access; `onboarding/`: first sign-in setup; `students/`: the students feature; `teachers/`: teacher goals) — check it before changing auth/API flows.

**Layering** (Server Component or client → server action → `serverApiRequest` → backend):
- `src/app` is thin: route files only compose module components. Providers live in `src/app/providers` (toaster).
- `src/modules/<name>/` holds feature code (`auth`, `onboarding`, `students`; `module-name` is a template). `src/modules/common/` holds shared components, constants, server API helper, hooks, utils.
- Reads: Server Components call `modules/<name>/api/*-server.ts` helpers. Writes: `"use server"` functions in `modules/<name>/actions/` that call `refresh()` on success; client components run them via `useServerAction` and branch on `result.ok`/`result.errorCode`. No React Query, no Zustand.
- `common/api/server-api-request.ts` (`server-only`): forwards request cookies, never throws, returns `ServerApiResponse` with only `errorCode` on failure; `forwardSetCookies` re-sets backend session cookies on this domain (Google exchange).
- `src/proxy.ts` is the only place that refreshes the session (before every render and server function); the backend tolerates parallel refreshes for 10 s (refresh grace window).
- Auth is Google-only and uses HttpOnly cookies on this app's domain: backend callback → `/auth/google/callback?code=` (or `?error=`) route handler → one-time code exchange. New users have `role: null` until `/onboarding` (`POST /onboarding`); `requireRoleServer` sends them there and returns an `OnboardedUser`. The current user comes from `auth/api/current-user-server.ts` (`server-only`, React `cache()` per request, fails soft to `null`) and is passed down as props.

**Conventions enforced by `write-frontend` skill** (read `.agents/skills/write-frontend/SKILL.md` for the full list):
- One folder per component containing `<name>.tsx`, `types.ts` (props — never inline), and `style.ts` (Tailwind class strings as a camelCase object, e.g. `onboardingFormStyles`).
- Arrow-function components; barrel `index.ts` files only where needed.
- No magic strings: use `TEXTS`, `ERRORS`, `APP_ROUTES`, `API_ROUTES`, and per-module `<MODULE>_CONFIG` objects (UPPER_SNAKE_CASE). Enums live in `<module>.enums.ts` only.
- Never show raw backend error text for auth failures; use frontend-owned `ERRORS` messages (prevents account-enumeration leaks).
- Generic components stay feature-agnostic; feature hooks/messages/toasts go in intent-specific wrappers (e.g. `GoogleSignInOAuthButton` wrapping the presentational `GoogleOAuthButton`).
- Pages compose `Section` + `Container` from `common/components`; theme via CSS variables in `src/app/globals.css`.
- Import alias: `@/` → `src/`.

## Skills

Claude versions live in `.claude/skills/` (`analyze-task`, `write-frontend`, `write-docs`, `question`, `do-review`); the Codex originals in `.agents/skills/` are kept as-is. Global rules stay in this file and `AGENTS.md`; skills hold the detailed procedures.
