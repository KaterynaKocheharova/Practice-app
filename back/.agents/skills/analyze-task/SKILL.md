---
name: analyze-task
description: Analyze backend tasks before implementation. Use to clarify requirements, research unknowns, propose an execution plan, identify risks and corrections, and produce many targeted clarification questions for the owner.
---

# Task Intake Skill

## Core Mission
Turn a raw backend request into an implementation-ready plan, or explain exactly what blocks readiness.

## Approval Gate
When this skill is explicitly requested by the user, stop after producing the Task Intake Summary output.

Do not proceed to `write-backend`, `write-swagger`, `write-docs`, file edits, implementation commands, build commands, or test commands until the user explicitly approves implementation after reviewing the analysis.

Allowed before stopping:
- inspect task-relevant files;
- summarize findings;
- ask clarification questions;
- provide a suggested handoff prompt.

Forbidden before approval:
- editing files;
- preparing patches;
- running implementation workflows;
- announcing that implementation is starting.

## Intake Workflow
1. Read `AGENTS.md` first, then inspect only the task-relevant modules, schemas, DTOs, services, repositories, tests, docs, or migrations.
2. Restate the task as concrete backend outcomes: API behavior, data changes, validation, errors, side effects, and verification.
3. Propose an ordered implementation plan.
4. Identify risks, conflicts, and corrections: architecture violations, naming drift, missing contracts, security exposure, migration hazards, error-handling gaps, and test gaps.
5. Do additional research when local context is insufficient, dependencies or framework behavior are uncertain, or the task relies on current external facts. Prefer official documentation or project-local references.
6. Ask many targeted clarification questions. Separate blocking questions from useful non-blocking questions.
   - Explain before asking for approval: for every security-sensitive mechanism (tokens, sessions, cookies, rate limits, secrets) and every exception to a rule in the plan, say in plain words why it is needed, why it is safe and what risk remains. Never state that something is required without the reason; the owner should not have to approve what they cannot follow.

## Output Format
```md
## Task Intake Summary
[Ready / Needs clarification / Blocked / Should reject, with one-sentence reason]

## Proposed Plan
- [Ordered implementation steps]

## Risks & Corrections
- [Risk, impact, and concrete correction]

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
