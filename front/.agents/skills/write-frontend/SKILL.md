---
name: write-frontend
description: Implement approved frontend changes in this Next.js app. Use after explicit edit approval for UI, hooks, API helpers, state, providers, routing, and module code.
---

# Write Frontend Skill

Implement only the approved frontend scope.

Follow `AGENTS.md` for edit approval, Next.js docs lookup, search discipline, and project structure.

## Frontend Rules

- Keep `src/app` thin: route files compose module code and own route-specific layout/loading/error boundaries.
- When adding a page, compose it with `Section` for vertical spacing and `Container` for centering/horizontal padding before adding feature content.
- Put reusable client/server API behavior in `src/modules/common/api`; put feature endpoint functions in `src/modules/<module-name>/api`.
- Put client orchestration in hooks, not in `actions`.
- Reserve `actions` folders for real Next `"use server"` functions.
- Keep Zustand stores UI-safe; do not store tokens or secrets.
- Use React Query for client data fetching and mutation status; use Server Components/server-only helpers for server-rendered data when requested.
- Add `"use client"` only at files that need browser APIs, hooks, Zustand, React Query, or event handlers.
- Components should follow SOLID principles in practical React terms: one clear responsibility, small props, minimal coupling, and extension through composition.
- Keep components as small as the feature allows; extract repeated or branching UI into named child components.
- Lists should always be extracted into a separate component instead of being embedded directly in page components or large parent components.
- Create only folders and barrel exports that are needed by the approved change.

## Verification

Run targeted checks for changed frontend code. Prefer:

```text
npm.cmd run lint
npx.cmd tsc --noEmit
```

Run `npm.cmd run build` when routing, providers, Next config, `src/app`, or framework boundaries change.
