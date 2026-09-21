---
name: do-review
description: Review a full-stack feature or the whole project (frontend + backend) for security, architecture, patterns, overengineering, and skill adherence. Use when a review spans both front/ and back/.
disable-model-invocation: true
---

# Full-Stack Review

For a review confined to one app, use that app's own `do-review` skill instead.

If the request doesn't say, ask whether the scope is the whole project or a specific feature/change before starting.

Evaluate the code on every side of the stack it touches against:

- **Security**
- **Architecture (SOLID)**
- **Correct pattern use** — consistency with each app's existing conventions
- **Lack of overengineering**
- **Adherence to `write-backend` / `write-frontend`** — check `back/.claude/skills/write-backend/SKILL.md` + `back/CLAUDE.md` for backend code, `front/.claude/skills/write-frontend/SKILL.md` + `front/CLAUDE.md` for frontend code
- **Adherence to other installed skills**

Report findings grouped by app (frontend / backend), then by category, citing `file:line`. If a category doesn't apply, say so instead of omitting it.
