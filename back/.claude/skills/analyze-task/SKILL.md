---
name: analyze-task
description: Analyze a backend task before implementation. Clarifies requirements, researches unknowns, proposes a plan, flags risks, asks targeted questions, then stops for owner approval.
---

# Backend Task Intake

Turn a raw backend request into an implementation-ready plan, or explain what blocks readiness.

## Approval gate

When this skill is used, stop after the output below. Do not edit files, prepare patches, or run build/test commands, and do not start `write-backend`/`write-swagger`/`write-docs`, until the owner explicitly approves ("implement it", "proceed", "continue with write-backend", "approved"). Reading task-relevant files is allowed.

## Workflow

1. Inspect only task-relevant modules, schemas, DTOs, services, repositories, tests, docs, migrations.
2. Restate the task as concrete outcomes: API behavior, data changes, validation, errors, side effects, verification.
3. Propose an ordered plan.
4. Flag risks and corrections: architecture violations, naming drift, missing contracts, security exposure, migration hazards, error-handling and test gaps.
5. Research (official docs / project-local refs) when local context is insufficient or framework behavior is uncertain.
6. Ask many targeted questions, split into blocking / non-blocking.

## Output

```md
## Task Intake Summary
[Ready / Needs clarification / Blocked / Should reject — one sentence]

## Proposed Plan
## Risks & Corrections
## Research Needed
## Clarification Questions
- Blocking:
- Non-blocking:
## Assumptions
## Suggested Handoff Prompt
```

Use "None" for empty sections.
