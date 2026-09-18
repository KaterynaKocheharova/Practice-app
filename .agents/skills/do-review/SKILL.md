---
name: do-review
description: Review a full-stack feature or the whole project (frontend + backend) for security, architecture, pattern use, overengineering, and skill adherence. Use when a review spans both `front/` and `back/`.
---

# Do Review Skill (Full-Stack)

Use this root-level skill when a review touches both `front/` and `back/`.
For a review confined to one app, use that app's own `do-review` skill
instead (`front/.agents/skills/do-review` or `back/.agents/skills/do-review`).

## Scope

If the request doesn't already say, ask whether the review covers the whole
project or a specific feature/change before starting.

## Checklist

Always evaluate the reviewed code against all of the following, applying
each item to whichever side(s) of the stack the feature touches:

- **Security**
- **Architecture (SOLID)**
- **Correct pattern use** — consistency with
  each app's existing conventions.
- **Lack of overengineering**
- **Adherence to `write-backend` / `write-frontend`** — for backend code,
  check against `back/.agents/skills/write-backend/SKILL.md` and
  `back/AGENTS.md`; for frontend code, check against
  `front/.agents/skills/write-frontend/SKILL.md` and `front/AGENTS.md`.
- **Adherence to other globally installed skills**

## Output

Report findings grouped first by app (frontend / backend), then by the
checklist categories above, citing `file:line`. Skip a category only when it
genuinely does not apply, and say so rather than omitting it silently.
