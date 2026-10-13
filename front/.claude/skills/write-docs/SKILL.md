---
name: write-docs
description: Write or update frontend docs under src/docs for implemented behavior — request flows, data/state/provider/auth flows, with Mermaid diagrams.
---

# Frontend Docs

Concise docs in `src/docs/<area>/` explaining actual implemented behavior: `architecture/` for cross-cutting topics (structure, design system, API requests, role access), one folder per feature (e.g. `students/`). Keep each Q&A file next to its feature doc; nothing at the `src/docs/` root. Prefer updating an existing doc over a near-duplicate. Lowercase kebab-case filenames.

## Diagrams (when relevant)

Use `flowchart TD`; use `sequenceDiagram` when order, retries, redirects, or async handoffs matter.

- request: component -> hook -> API function -> common API client -> backend
- Server Component: Server Component -> server data helper -> backend -> cache/revalidation
- provider: root layout -> provider composer -> provider
- state: Server Component or server action -> serverApiRequest -> backend; refresh() -> re-rendered UI
- auth/session: cookie ownership (this app's domain), proxy refresh, logout, protected-route decisions
- page composition: page -> Section -> Container -> feature components -> list/item components

## Level of detail

Document high-level logic only: the flow between layers, who may see or do what, key decisions with their reasons, and what the user sees on failure. Do not restate the code: no hook-by-hook or component-by-component walkthroughs, helper names, full prop/field lists or incidental implementation details; a reader who needs those reads the code. One short sentence per point, and a diagram over prose.

## Rules

- Inspect the implementation first; document actual behavior only, never planned behavior.
- Keep docs shorter than the code they explain; include file paths for key entrypoints.
- For design-system/UI structure changes, explain common component roles and usage rules.
