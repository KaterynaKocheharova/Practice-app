---
name: write-docs
description: Write or update frontend docs under src/docs for implemented behavior — request flows, data/state/provider/auth flows, with Mermaid diagrams.
---

# Frontend Docs

Concise docs in `src/docs/` explaining actual implemented behavior. Prefer updating an existing doc over a near-duplicate. Lowercase kebab-case filenames.

## Diagrams (when relevant)

Use `flowchart TD`; use `sequenceDiagram` when order, retries, redirects, or async handoffs matter.

- request: component -> hook -> API function -> common API client -> backend
- Server Component: Server Component -> server data helper -> backend -> cache/revalidation
- provider: root layout -> provider composer -> provider
- state: hook/mutation -> query cache -> Zustand store -> UI
- auth/session: cookie ownership, refresh, logout, protected-route decisions
- page composition: page -> Section -> Container -> feature components -> list/item components

## Rules

- Inspect the implementation first; document actual behavior only, never planned behavior.
- Keep docs shorter than the code they explain; include file paths for key entrypoints.
- For design-system/UI structure changes, explain common component roles and usage rules.
