# AGENTS.md

## Purpose

This file defines global rules for Codex at the repository root, which
contains two independently rooted apps:

- `front/` — Next.js frontend (see `front/AGENTS.md`)
- `back/` — NestJS backend, with its own nested git repo (see `back/AGENTS.md`)

Detailed execution rules live in selected skill files under:

```txt
.agents/skills/
```

Keep this file high-level. Put implementation details in the relevant skill.

## Skill Workflow

Root-level skills apply to work that spans both apps:

- `do-review`: review a full-stack feature or the whole project
  (frontend + backend) for security, architecture, patterns, overengineering,
  and skill adherence; ask whether scope is the whole project or a specific
  feature before starting.

For work confined to a single app, use `front/AGENTS.md` or `back/AGENTS.md`
and that app's own skills instead.

## Search Discipline Rule

Codex must not inspect large unrelated folders just to understand the project.

Codex should stop searching once enough context exists to safely complete the
selected skill.

If context is insufficient, Codex should ask a specific clarification or
state the limitation instead of crawling unrelated files.
