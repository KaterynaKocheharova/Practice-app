---
name: write-frontend
description: Implement approved frontend changes in this Next.js app — UI, hooks, API helpers, state, providers, routing, module code. Use only after explicit edit approval.
---

# Write Frontend

Implement only the approved scope. Read the relevant guide in `node_modules/next/dist/docs/` before Next-specific code. Project-wide layering, folder/file conventions, `TEXTS`/`ERRORS`/`APP_ROUTES` and Zustand rules are in `CLAUDE.md` — this skill adds the detailed rules.

## Server vs client

- Prefer Server Components for pages/layouts; add `"use client"` only in files needing browser APIs, hooks, Zustand, React Query, or handlers — push interactivity into child Client Components.
- Prefer server-side fetching for page data, protected-route decisions, and initial render data when it fits.
- React Query for client fetching/mutation status.
- Server auth helpers: server-only, forward request cookies, no same-origin fallback (avoids recursively rendering the Next app), fail soft to unauthenticated when the backend URL is missing/unavailable unless a hard error is required.
- Reusable API behavior in `common/api`; feature endpoint functions in `modules/<name>/api`. Client orchestration in hooks; `actions/` only for real `"use server"` functions.
- Zustand stores hold UI-safe state only; hooks (incl. aggregate ones like `useAuth()`) select only the fields they return.

## Components

- Arrow functions; implicit return when no local logic.
- One folder per component (including simple primitives) with `<name>.tsx`, `types.ts`, `style.ts`. Props/local types never inline in `.tsx`.
- Keep folder name, component, props type, and style object on the same term (`auth-form-wrapper` -> `AuthFormWrapper` / `AuthFormWrapperProps` / `authFormWrapperStyles`).
- Tailwind classes live in `style.ts` (camelCase export). For conditional classes expose a helper (`root(isStacked)`) instead of multi-line `cn(...)` in JSX. Style maps stay out of module config objects.
- Avoid optional fields in types when distinct required shapes are clearer; use `Pick`/`Omit`/composition for create/update/view variants.
- SOLID in practical React terms: one responsibility, small props, composition. Extract repeated/branching UI, bulky field/radio groups, mapped option markup into named children; parents pass focused props (register props, error id, error message).
- Lists are always extracted into their own component.
- Generic components stay feature-agnostic; feature hooks, endpoints, messages, toasts live in intent-specific wrappers (`SignInVerificationStatus` wraps generic `Verification`; `GoogleSignInOAuthButton` wraps a presentational OAuth button).
- Move a component to `common/components` as soon as it is a generic primitive.
- Name by intent, not visuals; use a `variant` prop for same-role/different-style. Map arrays for repeated links/items. No duplicate navigation surfaces. Use `lucide-react` icons and the common `Loader`. Stateful UI behavior that obscures render intent goes in a named hook (`useSidebar`).
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

## Verification

Run `npm.cmd run lint` and `npx.cmd tsc --noEmit`; add `npm.cmd run build` when routing, providers, Next config, `src/app`, or framework boundaries change.
