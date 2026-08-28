# AGENTS.md

## Purpose

This file defines global rules for Codex.

Detailed execution rules live in selected skill files under:

```txt
.agents/skills/
```

Keep this file high-level. Put implementation details in the relevant skill.

---

## Core Workflow Principle

This repository uses an implementation-first manual workflow.

Default backend workflow:

```txt
analyze-task
-> write-backend
-> write-swagger
-> write-docs
```

---

## Mandatory Task Analyze Rule

All new task prompts should pass through `analyze-task` before execution.

Exception:

```txt
Skip analyze-task for this request.
```

## Search Discipline Rule

Codex must not inspect large unrelated folders just to understand the project.

Codex should stop searching once enough context exists to safely complete the selected skill.

If context is insufficient, Codex should ask a specific clarification or state the limitation instead of crawling unrelated files.

---

## Shared Module Rules

Backend modules live under:

```txt
src/modules/
```

Expected module shape:

```txt
src/modules/
|-- index.ts
`-- <module-name>/
    |-- <module-name>.module.ts
    |-- controllers/
    |-- services/
    |-- repositories/
    |-- dto/
    |-- schemas/
    |-- types/
    |-- enums/
    |-- constants/
    `-- tests/
```

General rules:

- use lowercase kebab-case for folders;
- keep naming consistent inside a module;
- maintain module barrel exports under `src/modules/` only;
- keep dependency direction `Controller -> Service -> Repository -> Database`;
- keep controllers thin;
- place business logic in services;
- place persistence/data-access logic in repositories when persistence is involved;
- place request/response contracts in `dto/`;
- place Drizzle tables in `schemas/schema.ts`;
- avoid circular dependencies;
- avoid deep cross-module imports that bypass public module exports.

---

### `write-backend`

For production code changes:

- run build when a build command is available;
- run only relevant existing tests for affected modules or files;
- do not run full `npm test` by default.

Prefer targeted commands such as:

```bash
npm run build
npm test -- <module-name>
npm test -- <test-file>
npm run test -- <module-name>
npm run test -- <test-file>

```
---

## Human Owner Responsibility

The human owner keeps responsibility for:

- final architecture decisions;
- business logic validation;
- product behavior;
- security-sensitive decisions;
- accepting or rejecting Codex output;
- final merge approval.

Codex assists with execution.

Codex does not replace human ownership.
