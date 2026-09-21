---
name: do-review
description: Review a feature or the whole backend app for security, architecture, patterns, overengineering, and skill adherence.
disable-model-invocation: true
---

# Backend Review

If the request doesn't say, ask whether the scope is the whole project or a specific feature/change before starting.

Evaluate against all of:

- **Security**
- **Architecture (SOLID)**
- **Correct pattern use** — consistency with existing module conventions
- **Lack of overengineering**
- **Adherence to `write-backend`** (`.claude/skills/write-backend/SKILL.md`, including its "Backend self-review" list) and, if touched, `write-swagger` and `write-docs`
- **Adherence to other installed skills**

Report findings grouped by category, citing `file:line`. If a category doesn't apply, say so instead of omitting it.
