# CLAUDE.md

Monorepo with two independently rooted apps, each with its own `CLAUDE.md` (read it when working inside that app):

- `front/` — Next.js frontend
- `back/` — NestJS backend (its own nested git repo)

Codex rules live in `AGENTS.md` / `.agents/skills/`; Claude equivalents live in `.claude/skills/` (root, `front/`, `back/`). Keep both in sync when workflow rules change.

## Rules

- Work confined to one app: follow that app's `CLAUDE.md` and skills. Reviews spanning both: use the root `do-review` skill.
- Don't crawl large unrelated folders to understand the project; stop searching once there is enough context, otherwise ask a specific question.
- The human owner keeps final say on architecture, product behavior, security-sensitive decisions, and merge approval.
