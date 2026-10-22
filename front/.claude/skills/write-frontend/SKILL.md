---
name: write-frontend
description: Implement approved frontend changes in this Next.js app — UI, hooks, API helpers, state, providers, routing, module code. Use only after explicit edit approval.
---

# Write Frontend

Implement only the approved scope. Read the relevant guide in `node_modules/next/dist/docs/` before Next-specific code. Project-wide layering, folder/file conventions, `TEXTS`/`ERRORS`/`APP_ROUTES` rules are in `CLAUDE.md` — this skill adds the detailed rules.

## Server vs client

- The browser never calls the backend: it may live on another site, so its cookies would not reach the Next server. Every backend call goes through `serverApiRequest` (`common/api/server-api-request.ts`, `server-only`), which forwards the request cookies, never throws (returns `ServerApiResponse`), and passes only `errorCode` to the client — never backend text. The backend URL is the server-only `API_URL`.
- Reads: Server Components fetch with `modules/<name>/api/*-server.ts` helpers and render the result; a failed load renders an error with `RefreshButton` (router refresh), a missing resource renders a not-found message.
- Writes: `"use server"` functions in `modules/<name>/actions/`; they call `refresh()` from `next/cache` on success. Client components call them through `useServerAction` (`common/hooks`) and branch on `result.ok` / `result.errorCode`. Validate on the client with zod as before; the backend re-validates and authorizes.
- Session refresh happens only in `src/proxy.ts` (before every render and server function). Never refresh anywhere else: the backend's grace window absorbs parallel refreshes, and extra refreshers only add races.
- Session cookies live on this app's domain: pass `forwardSetCookies: true` only in server functions / route handlers where the backend issues session cookies (Google exchange).
- Client-only exceptions: files go browser → storage with a presigned URL (`uploadToPresignedUrl`), and OAuth starts with a browser redirect. Keep client state local (`useState`, URL params); do not add React Query or Zustand.
- Prefer Server Components for pages/layouts; add `"use client"` only in files needing browser APIs, hooks, or handlers — push interactivity into child Client Components.

## Components

- Arrow functions; implicit return when no local logic.
- One folder per component (including simple primitives) with `<name>.tsx`, `types.ts`, `style.ts`. Props/local types never inline in `.tsx`.
- Keep folder name, component, props type, and style object on the same term (`auth-form-wrapper` -> `AuthFormWrapper` / `AuthFormWrapperProps` / `authFormWrapperStyles`).
- Tailwind classes live in `style.ts` (camelCase export). For conditional classes expose a helper (`root(isStacked)`) instead of multi-line `cn(...)` in JSX. Style maps stay out of module config objects.
- Avoid optional fields in types when distinct required shapes are clearer; use `Pick`/`Omit`/composition for create/update/view variants.
- SOLID in practical React terms: one responsibility, small props, composition. Extract repeated/branching UI, bulky field/radio groups, mapped option markup into named children; parents pass focused props (register props, error id, error message).
- Lists are always extracted into their own component.
- Generic components stay feature-agnostic; feature hooks, endpoints, messages, toasts live in intent-specific wrappers (`GoogleSignInOAuthButton` wraps a presentational OAuth button).
- Move a component to `common/components` as soon as it is a generic primitive.
- Name by intent, not visuals; use a `variant` prop for same-role/different-style. Map arrays for repeated links/items. No duplicate navigation surfaces. Use `lucide-react` icons and the common `Loader`. Stateful UI behavior that obscures render intent goes in a named hook (`useSidebar`).
- Secondary add/create forms inside a details view (e.g. adding documents to a course) stay collapsed behind a low-emphasis "+ Add …" toggle (`ghost` variant, muted text) that opens them, and close again after success. Don't render them permanently expanded or style the toggle as a primary/accent button; the page's main content keeps the visual weight.
- One async style per flow: `async`/`await` + `try`/`catch`; keep the effect callback synchronous and call the inner helper with `void`.
- Create only the folders/barrels the approved change needs.

## Constants, enums, schemas

- No app-owned magic strings (field names, DOM/error ids, query params, input types, autocomplete values, enum-like values, routes) — use one `<MODULE>_CONFIG` object per module (e.g. `AUTH_CONFIG = { cookies, fields, queryKeys }`). Endpoint maps and error messages are exceptions with dedicated constants. One-off non-contract strings may stay inline.
- Shared display text in `common/constants` `TEXTS`; user-facing errors in a separate `ERRORS`; routes in `APP_ROUTES`. Exported constants are `UPPER_SNAKE_CASE`.
- Closed runtime value sets are TypeScript `enum`s, in a single `<module>.enums.ts` (not in config/component/hook/api/state/type files). Prefer enums over `as const` + derived unions.
- Feature-only pure functions (form-value → request mappers, input parsers) go in `modules/<name>/utils/`, not in component folders. Move them to `common/utils` only when another module needs them.
- Reuse schemas: feature-wide field schemas in the feature module, form schemas composed from them, named by intent (required password vs. new password).

## Forms

Clear fields after a successful mutation when values shouldn't remain (esp. passwords), preserving intentional defaults such as a default role.

## Comments

Do not write code comments.

## Verification

Run `npm.cmd run lint` and `npx.cmd tsc --noEmit`; add `npm.cmd run build` when routing, providers, Next config, `src/app`, or framework boundaries change.
