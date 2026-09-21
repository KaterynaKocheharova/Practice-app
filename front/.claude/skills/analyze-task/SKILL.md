---
name: analyze-task
description: Analyze a frontend task before implementation. Clarifies requirements, proposes a plan, flags UX/security/architecture/data-flow concerns, then stops for owner approval before any code changes.
---

# Frontend Task Intake

Turn a raw frontend request into an implementation-ready plan, or explain what blocks readiness.

## Approval gate

When this skill is used, stop after the output below. Do not edit files, prepare patches, install packages, or run build/lint/test commands until the owner explicitly approves ("implement it", "proceed", "approved", "continue with write-frontend"). Reading task-relevant files (and local Next.js docs in `node_modules/next/dist/docs/`) is allowed.

## Workflow

1. Read only task-relevant routes, components, modules, hooks, API helpers, state, styles, and `src/docs`.
2. Restate the task as concrete outcomes: route behavior, UI states, data loading, mutations, validation, errors, responsiveness, accessibility, verification.
3. Propose an ordered plan without code.
4. Flag risks: security/auth leakage, client/server boundary mistakes, caching/revalidation, a11y, hydration, state ownership, bundle size, naming drift.
5. Ask targeted questions, split into blocking / non-blocking.

## Output

```md
## Task Intake Summary
[Ready / Needs clarification / Blocked / Should reject — one sentence]

## Proposed Plan
## Suggestions
## Security Concerns
## Architecture Concerns
## UX & Accessibility Concerns
## Research Needed
## Clarification Questions
- Blocking:
- Non-blocking:
## Assumptions
## Suggested Handoff Prompt
```

Use "None" for empty sections.
