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

- **Security**
- **Architecture (SOLID)**
- **Correct pattern use** — consistency with existing module/component
  conventions
- **Lack of overengineering**
- **Adherence to `write-frontend`** — check the reviewed code against
  `.agents/skills/write-frontend/SKILL.md` (frontend structure, component
  conventions, forms/controls rules). Also check `.agents/skills/write-docs/
  SKILL.md` if documentation was touched.
- **Adherence to other globally installed skills**

## Output

Report findings grouped by the checklist categories above, citing
`file:line`. Skip a category only when it genuinely does not apply, and say
so rather than omitting it silently.
