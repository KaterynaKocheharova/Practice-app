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
- Put client orchestration in hooks, not in `actions`.
- Reserve `actions` folders for real Next `"use server"` functions.
- Keep Zustand stores UI-safe; do not store tokens or secrets.
- Use React Query for client data fetching and mutation status; use Server Components/server-only helpers for server-rendered data when requested.
- For server-rendered auth/session data, use server-only helpers that forward request cookies to the backend and avoid same-origin fallbacks that can recursively render the Next app. Server auth helpers should fail soft to unauthenticated when the backend URL is missing or unavailable unless the feature explicitly needs a hard error.
- Add `"use client"` only at files that need browser APIs, hooks, Zustand, React Query, or event handlers.
- Components should follow SOLID principles in practical React terms: one clear responsibility, small props, minimal coupling, and extension through composition.
- Keep components as small as the feature allows; extract repeated or branching UI into named child components.
- Lists should always be extracted into a separate component instead of being embedded directly in page components or large parent components.
- Create only folders and barrel exports that are needed by the approved change.

## Component Conventions

- Use arrow-function components. Prefer implicit JSX returns when no local logic is needed; use an explicit function body when the component needs derived values, callbacks, or conditional returns.
- Do not cram multiple meaningful components into one file. For composite UI, create one folder per component or subcomponent with a matching component file.
- Put component prop interfaces and local types in a colocated `types.ts` file near the component that owns them.
- Put Tailwind class strings in a colocated `style.ts` object and access them through object properties from JSX. If class selection is conditional, expose a style helper such as `root(isStacked)` from `style.ts` instead of putting multi-line `cn(...)` logic in JSX.
- Put local static render data, such as link lists, in a colocated `constants.ts`. Move constants up to the nearest shared parent folder when multiple sibling components need the same data.
- Keep shared display text in `src/modules/common/constants` under a `TEXTS` object. Keep app navigation paths in an `APP_ROUTES` object, similar to endpoint constants.
- Use mapped arrays for repeated navigation links or repeated UI items instead of duplicating JSX.
- Avoid duplicate navigation surfaces. For example, a sidebar app nav should not repeat auth links when an auth-actions component already renders them.
- Put related stateful UI behavior in named hooks, such as `useSidebar`, when it starts to obscure the component's render intent.
- Prefer reusable common components for repeated loading UI, such as `Loader`, instead of one-off placeholder `div`s.
- Use installed icon components, such as `lucide-react`, for standard UI icons instead of hand-built span/SVG markup.
- Name components by intent, not visual treatment. Use one component with a `variant` prop when two elements have the same role but different styling.

## Verification

Run targeted checks for changed frontend code. Prefer:

```text
npm.cmd run lint
npx.cmd tsc --noEmit
```

Run `npm.cmd run build` when routing, providers, Next config, `src/app`, or framework boundaries change.
