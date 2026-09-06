---
name: analyze-task
description: Analyze frontend Next.js tasks before implementation. Use to clarify requirements, propose a plan, identify UX, security, architecture, data-flow, and testing concerns, and stop before code changes until approved.
---

# Frontend Task Intake Skill

## Core Mission

Turn a raw frontend request into an implementation-ready plan, or explain exactly what blocks readiness.

## Approval Gate

When this skill is explicitly requested by the user, stop after producing the Task Intake Summary output.

Do not proceed to `write-frontend`, file edits, implementation commands, build commands, lint commands, or test commands until the user explicitly approves implementation after reviewing the analysis.

Allowed before stopping:

- inspect task-relevant files;
- read relevant local Next.js docs under `src/docs`;
- summarize findings;
- propose architecture and UX options;
- ask clarification questions;
- provide a suggested handoff prompt.

Forbidden before approval:

- editing files;
- preparing patches;
- running implementation workflows;
- announcing that implementation is starting.

## Intake Workflow

1. Read `AGENTS.md` first, then inspect only task-relevant routes, components, modules, hooks, API helpers, actions, state, styles, tests, and config.
2. Restate the task as concrete frontend outcomes: route behavior, UI states, data loading, mutations, validation, error states, responsiveness, accessibility, and verification.
3. Propose an ordered implementation plan without writing code.
4. Identify risks and corrections, including security exposure, client/server boundary mistakes, auth or tenant leakage, unsafe data handling, caching/revalidation concerns, accessibility gaps, hydration issues, state ownership problems, bundle-size concerns, naming drift.

## Output Format

```md
## Task Intake Summary
[Ready / Needs clarification / Blocked / Should reject, with one-sentence reason]
5. Ask targeted clarification questions. Separate blocking questions from useful non-blocking questions.
6. Add practical suggestions when they improve maintainability, UX, or architecture without expanding the approved scope.

## Proposed Plan
- [Ordered implementation steps]

## Suggestions
- [Optional improvements or alternatives worth considering]

## Security Concerns
- [Security, privacy, auth, data exposure, or "None"]

## Architecture Concerns
- [Next.js, module structure, state, data-flow, caching, or "None"]

## UX & Accessibility Concerns
- [Responsive states, loading/error/empty states, keyboard/screen-reader concerns, or "None"]

## Research Needed
- [Unknowns to verify, source to check, or "None"]

## Clarification Questions
- Blocking: [Questions that must be answered before implementation]
- Non-blocking: [Questions that improve accuracy but can be assumed]

## Assumptions
- [Material assumptions only]

## Suggested Handoff Prompt
[Compact prompt for the next workflow skill]
```
