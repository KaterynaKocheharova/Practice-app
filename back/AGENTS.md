# AGENTS.md

## Purpose

This file defines the global operating rules for Codex in this repository.

The human owner manually selects each workflow step by choosing a skill in the prompt.

Detailed execution rules live inside the selected skill directory under:

```txt
.agents/skills/
```
---

## Core Workflow Principle

This repository uses an implementation-first manual workflow.

Default backend workflow:

```txt
analyze-task
-> write-backend
-> aqa
-> write-swagger
```

---

## Workflow Skill Names

Use only these workflow skill names:

```txt
analyze-task
write-backend
write-swagger
```

Examples:

```txt
Use analyze-task skill.
Use write-backend skill.
```
---

## Mandatory Task Analyze Rule

All new task prompts should pass through `analyze-task` before execution.

Exception:

```txt
Skip analyze-task for this request.
```
---

## Available Skills

Registered Codex skills:

```txt
.codex/
├── config.toml
├── skills/
│   ├── analyze-task.md
│   ├── write-backend.md
│   ├── write-swagger.md
└── AGENTS.md
```
---

## Search Discipline Rule

Use precise searches before broad searches.

Prefer targeted commands:

```bash
rg "AuthService" src/modules/auth
rg "refresh" src/modules/auth src/modules/sessions
rg "SessionRepository" src/modules
```

Avoid broad commands unless justified:

```bash
rg ".*" src
find . -type f
rg "service" src
```

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
├── index.ts
└── <module-name>/
    ├── <module-name>.module.ts
    ├── controllers/
    ├── services/
    ├── repositories/
    ├── dto/
    └── tests/
```

General rules:

- use lowercase kebab-case for folders;
- keep naming consistent inside a module;
- maintain module barrel exports under `src/modules/` only;
- keep dependency direction `Controller -> Service -> Repository`;
- keep controllers thin;
- place business logic in services;
- place persistence/data-access logic in repositories when persistence is involved;
- place request/response contracts in `dto/`;
- avoid circular dependencies;
- avoid deep cross-module imports that bypass public module exports.

Detailed module rules live in the selected skill file.

---

## Shared Import And Barrel Rules

Use direct imports for shared infrastructure, constants, helpers, config, and types.

Do not rely on broad re-export barrels for:

- `src/common/`;
- `src/constant/`;
- `src/helpers/`;
- `src/config/`;
- shared types.

Reason: broad re-export chains can make TypeScript-aware ESLint lose exact type information for `as const` objects, inferred union types, and shared helper types.

Allowed barrels:

- `src/modules/index.ts`;
- local module barrels such as `controllers/index.ts`, `services/index.ts`, `repositories/index.ts`, and `dto/index.ts`.

Use direct imports such as:

```ts
import { ENVIRONMENT } from '../constant/environment/environment';
import { ERROR_CODE } from '../constant/messages/error/code';
import { ErrorCode } from '../constant/messages/error/types/error-code.type';
```

Avoid:

```ts
import { ENVIRONMENT, ERROR_CODE, ErrorCode } from '../constant';
```
---

## Shared Naming Rules

Use lowercase kebab-case for folders and docs paths.

Keep naming consistent between:

- module name;
- controller name;
- service name;
- repository name;
- DTO names;
- test files;
- Swagger constants folder;
- docs instance folder.

Common patterns:

```txt
<module-name>.controller.ts
<module-name>.service.ts
<module-name>.module.ts
<module-name>.controller.spec.ts
<module-name>.service.spec.ts
src/constant/swagger/<controller-name>/
docs/<instance-name>/<topic>.md
```

Codex must flag naming inconsistencies when they create unclear ownership, import confusion, Swagger confusion, test confusion, or documentation duplication.

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

### `write-swagger`

For Swagger changes:

- run build only when Swagger changes affect TypeScript code;
- do not run tests for Swagger-only changes unless runtime behavior changed or the human explicitly asks.

Build is relevant when:

- controller Swagger decorators changed;
- Swagger constants changed;
- imports changed.

Default build command:

```bash
npm run build
```

### Reusing validation

If a previous workflow step already ran build or relevant tests and no relevant files changed since then, Codex may reuse that validation result.

Codex must clearly state when validation was reused.

If validation cannot be run, Codex must state why.

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
