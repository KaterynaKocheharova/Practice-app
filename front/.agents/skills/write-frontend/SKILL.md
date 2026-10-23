---
name: write-frontend
description: Implement approved frontend changes in this Next.js app. Use after explicit edit approval for UI, hooks, API helpers, state, providers, routing, and module code.
---

# Write Frontend Skill

Implement only the approved frontend scope.

Follow `AGENTS.md` for edit approval, Next.js docs lookup, search discipline, and project structure.

## Frontend Rules

- Keep `src/app` thin: route files compose module code and own route-specific layout/loading/error boundaries.
- Prefer Server Components for route pages and layouts. Add `"use client"` to pages only when the page itself truly needs browser APIs, event handlers, or client-only state; otherwise push interactivity into child Client Components.
- When adding a page, compose it with `Section` for vertical spacing and `Container` for centering/horizontal padding before adding feature content.
- Put reusable client/server API behavior in `src/modules/common/api`; put feature endpoint functions in `src/modules/<module-name>/api`.
- Never render raw backend error text for authentication failures (sign-in, etc.). Use a frontend-owned generic message (from `ERRORS`) instead, so a future change to the backend's error copy can't leak account-enumeration signals through the UI.
- The browser never calls the backend. Read data in Server Components through `modules/<name>/api/*-server.ts` helpers built on `serverApiRequest` (forwards request cookies, never throws, exposes only `errorCode`). Write through `"use server"` functions in `modules/<name>/actions/` that call `refresh()` on success; client components call them via `useServerAction` and branch on `result.ok` / `result.errorCode`.
- Session refresh happens only in `src/proxy.ts`. Do not add refresh logic anywhere else. Use `forwardSetCookies: true` only where the backend issues session cookies (verify, Google exchange).
- Client-only exceptions: presigned storage uploads (`uploadToPresignedUrl`) and OAuth browser redirects. Keep client state local (`useState`, URL params); do not add React Query or Zustand.
- For server-rendered auth/session data, use server-only helpers that forward request cookies to the backend and avoid same-origin fallbacks that can recursively render the Next app. Server auth helpers should fail soft to unauthenticated when the backend URL is missing or unavailable unless the feature explicitly needs a hard error.
- Prefer server-side data fetching for page data, protected-route decisions, and initial render data when it fits the flow.
- Add `"use client"` only at files that need browser APIs, hooks, or event handlers.
- Components should follow SOLID principles in practical React terms: one clear responsibility, small props, minimal coupling, and extension through composition.
- Keep components as small as the feature allows; extract repeated or branching UI into named child components.
- Extract bulky form field groups, radio groups, mapped option markup, and other multi-element controls into named components when they start to obscure the parent form's request flow. The parent form should pass only focused props such as registration props, error id, and error message.
- Generic components must stay generic. Keep feature-specific hooks, endpoint selection, messages, and branching in higher-level intent-specific wrappers, then pass behavior/data into the generic component. For example, keep a generic `Verification` component unaware of sign-in/sign-up: `SignInVerificationStatus` should call the sign-in verification hook, choose sign-in messages, and pass the behavior/data down; `SignUpVerificationStatus` should do the same for sign-up.
- Keep presentational controls free of feature mutations and toast policy. For a reusable visual control such as an OAuth button, put hook calls, mutation aliases, endpoint intent, selected form values, and failure toasts in intent-specific wrappers such as `GoogleSignInOAuthButton` and `GoogleSignUpOAuthButton`, then pass only UI props into the base button.
- Lists should always be extracted into a separate component instead of being embedded directly in page components or large parent components.
- Put feature-only pure functions, such as form-value-to-request mappers and input parsers, in `src/modules/<module-name>/utils/`, not inside component folders. Move them to `src/modules/common/utils` only when another module needs them.
- Create only folders and barrel exports that are needed by the approved change.


## Component Conventions

- Use arrow-function components. Prefer implicit JSX returns when no local logic is needed; use an explicit function body when the component needs derived values, callbacks, or conditional returns.
- Do not cram multiple meaningful components into one file. Create one folder per component or subcomponent with a matching component file, including simple reusable primitives when they have props/styles/types.
- Put component/page/provider prop interfaces and local types in a colocated `types.ts` file inside that page, component, or provider folder. Do not define prop interfaces inline in `.tsx` files.
- Avoid optional fields in interfaces and types when a distinct required-shape type would make the data contract clearer. Prefer separate types, `Pick`, `Omit`, or other explicit type composition for create/update/view variants instead of broad types with many `?` fields.
- Put Tailwind class strings in a colocated `style.ts` object and access them through object properties from JSX. If class selection is conditional, expose a style helper such as `root(isStacked)` from `style.ts` instead of putting multi-line `cn(...)` logic in JSX. Keep `style.ts` maps standalone; they do not belong in module config objects. Name `style.ts` exports in camelCase (e.g. `signInFormStyles`, `authFormWrapperStyles`); the `UPPER_SNAKE_CASE` rule below applies to shared config/constant objects (`TEXTS`, `ERRORS`, `AUTH_CONFIG`), not per-component style objects.
- Keep a component folder's name, exported component, props type, and style object aligned on the same term (e.g. the `auth-form-wrapper` folder exports `AuthFormWrapper`/`AuthFormWrapperProps`/`authFormWrapperStyles`). Avoid drift such as a `-wrapper` folder exporting a `*Shell` symbol.
- Keep shared display text in `src/modules/common/constants` under a `TEXTS` object. Keep user-facing error and validation messages in a separate common `ERRORS` constant. Keep app navigation paths in an `APP_ROUTES` object, similar to endpoint constants.
- Avoid app-owned magic strings in JSX and handlers. Extract field names, DOM ids, error ids, query param names, input types, autocomplete values, enum-like values, and repeated route/status strings into a single module-level config object or appropriate shared constants. Standard strings may stay inline only when they are one-off and not part of a contract.
- Name exported static constants and config objects in `UPPER_SNAKE_CASE`.
- Prefer one uppercase exported config object per module instead of scattered constants, such as `AUTH_CONFIG = { cookies: {}, fields: {}, queryKeys: {} }`. Endpoints/path maps and user-facing error messages are explicit exceptions and may stay in dedicated constants.
- Use TypeScript `enum`s for closed runtime value sets that are passed through props or used in comparisons. Prefer enums over `as const` objects plus derived union types when runtime values are needed. Put module enums in one separate module-level file named `<module>.enums.ts`, such as `auth.enums.ts` or `common.enums.ts`; do not define enums inside config, component, hook, API, state, or type files.
- Reuse schemas and validation primitives wherever possible. Put feature-wide field schemas in the feature module, compose form-specific schemas from those pieces, and keep different validation strength explicit by naming schemas by intent, such as required password vs. new password.
- Move reusable components to `src/modules/common/components` as soon as they are generic UI primitives, even if they were first introduced for one feature.
- Use mapped arrays for repeated navigation links or repeated UI items instead of duplicating JSX.
- Avoid duplicate navigation surfaces. For example, a sidebar app nav should not repeat auth links when an auth-actions component already renders them.
- Put related stateful UI behavior in named hooks, such as `useSidebar`, when it starts to obscure the component's render intent.
- Prefer reusable common components for repeated loading UI, such as `Loader`, instead of one-off placeholder `div`s.
- Use installed icon components, such as `lucide-react`, for standard UI icons instead of hand-built span/SVG markup.
- Name components by intent, not visual treatment. Use one component with a `variant` prop when two elements have the same role but different styling.
- Use one async style consistently inside a component or flow. Prefer `async`/`await` with `try`/`catch` for mutation handlers and effect-triggered async helpers when nearby code uses that style; keep the React effect callback itself synchronous and call the inner async helper with `void`.

## Forms And Controls

- Clear form fields after a successful mutation when the submitted values should not remain on screen, especially auth forms containing passwords. Preserve intentional defaults, such as a default role, when resetting.

## Comments

- Do not write code comments.

## Verification

Run targeted checks for changed frontend code. Prefer:

```text
npm.cmd run lint
npx.cmd tsc --noEmit
```

Run `npm.cmd run build` when routing, providers, Next config, `src/app`, or framework boundaries change.
