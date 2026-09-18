---
name: do-review
description: Review a feature or the whole backend app for security, architecture, pattern use, overengineering, and skill adherence. Use when asked to review, audit, or check backend code quality.
---

# Do Review Skill

Follow `AGENTS.md` for search discipline and project structure.

## Scope

If the request doesn't already say, ask whether the review covers the whole
project or a specific feature/change before starting.

## Checklist

Always evaluate the reviewed code against all of the following:

- **Security** — auth/authZ/RBAC gaps, tenant/user data isolation, unsafe
  error messages, sensitive data in logs, unvalidated input reaching a
  repository or external call.
- **Architecture (SOLID)** — dependency direction
  `Controller -> Service -> Repository -> Database`, thin controllers,
  business logic confined to services, persistence confined to repositories.
- **Correct pattern use** — idiomatic NestJS/Drizzle usage and consistency
  with existing module conventions.
- **Lack of overengineering** — no speculative abstractions, no unused
  flexibility, no unnecessary indirection.
- **Adherence to `write-backend`** — check the reviewed code against
  `.agents/skills/write-backend/SKILL.md`, including its "Backend
  Self-Review" checklist (magic strings, over-broad projections, repository
  duplication, misplaced responsibilities). Also check
  `.agents/skills/write-swagger/SKILL.md` and `.agents/skills/write-docs/
  SKILL.md` if Swagger/docs were touched.
- **Adherence to other globally installed skills** — check
  `~/.agents/skills/` for any other installed skill (e.g.
  `nestjs-best-practices`) with rules relevant to the reviewed code.

## Output

Report findings grouped by the checklist categories above, citing
`file:line`. Skip a category only when it genuinely does not apply, and say
so rather than omitting it silently.
