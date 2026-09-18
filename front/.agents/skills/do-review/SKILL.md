---
name: do-review
description: Review a feature or the whole frontend app for security, architecture, pattern use, overengineering, and skill adherence. Use when asked to review, audit, or check frontend code quality.
---

# Do Review Skill

Follow `AGENTS.md` for search discipline and project structure.

## Scope

If the request doesn't already say, ask whether the review covers the whole
project or a specific feature/change before starting.

## Checklist

Always evaluate the reviewed code against all of the following:

- **Security** — unsafe input handling, exposed secrets/tokens (e.g. tokens
  stored in Zustand), unsafe use of server-only data on the client, missing
  auth checks on protected routes.
- **Architecture (SOLID)** — single responsibility, small props, minimal
  coupling, extension through composition.
- **Correct pattern use** — idiomatic Next.js App Router usage (Server vs.
  Client Components), and consistency with existing module/component
  conventions.
- **Lack of overengineering** — no speculative abstractions, no unused
  flexibility, no unnecessary indirection.
- **Adherence to `write-frontend`** — check the reviewed code against
  `.agents/skills/write-frontend/SKILL.md` (frontend structure, component
  conventions, forms/controls rules). Also check `.agents/skills/write-docs/
  SKILL.md` if documentation was touched.
- **Adherence to other globally installed skills** — check
  `~/.agents/skills/` for any other installed skill with rules relevant to
  the reviewed code.

## Output

Report findings grouped by the checklist categories above, citing
`file:line`. Skip a category only when it genuinely does not apply, and say
so rather than omitting it silently.
