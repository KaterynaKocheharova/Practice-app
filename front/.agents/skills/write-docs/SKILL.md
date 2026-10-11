---
name: write-docs
description: Write or update frontend documentation for implemented behavior. Use for module docs, request flows, data flows, state flows, provider flows, and Mermaid diagrams under src/docs.
---

# Write Docs Skill

Write concise frontend docs that explain actual implemented behavior.

Follow `AGENTS.md` for edit approval, search discipline, and project structure.

## Scope

Use this skill for Markdown docs under:

```text
src/docs/
```

Prefer updating an existing doc over creating a near-duplicate.

## Required Content

When relevant, document flows with Mermaid diagrams:

- request flow: component -> hook -> API function -> common API client -> backend;
- Server Component data flow: Server Component -> server data helper -> backend -> cache/revalidation;
- provider flow: root layout -> provider composer -> individual provider;
- state flow: Server Component or server action -> serverApiRequest -> backend; refresh() -> re-rendered UI;
- auth/session flow: cookie ownership (this app's domain), proxy refresh, logout, and protected-route decisions.
- page composition flow: page -> Section -> Container -> feature components -> list/item components.

Use `flowchart TD` for request, provider, state, and auth flows.

Use `sequenceDiagram` when order, retries, redirects, or async handoffs matter.

## Rules

- Document actual behavior only.
- Inspect the implementation before writing docs.
- Keep docs practical and shorter than the code they explain.
- Include implementation file paths for important entrypoints.
- Explain common component roles and usage rules when documenting design-system or UI structure changes.
- Use lowercase kebab-case filenames.
- Do not present planned behavior as implemented behavior.
