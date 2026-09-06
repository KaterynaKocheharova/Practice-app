<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Purpose

This file defines global rules for Codex in this frontend repository.

Detailed execution rules live in selected skill files under:

```text
.agents/skills/
```

Keep this file high-level. Put implementation details in the relevant skill.

## Core Workflow Principle

Default frontend workflow:

```text
analyze-task
-> owner approval
-> write-frontend
```

## Editing Gate

Codex may inspect files, answer questions, and produce analysis without making changes.

Codex may edit files, install packages, run code-generation commands, or otherwise mutate the workspace only when the user explicitly requests implementation or edits. Examples:

- "implement it";
- "proceed";
- "apply the change";
- "edit the files";
- "add this";
- "fix this".

Questions, architecture discussion, code review, and `analyze-task` requests are not edit approval unless the user explicitly asks for changes.

## Mandatory Task Analyze Rule

All new task prompts should pass through `analyze-task` before execution.

Exception:

```text
Skip analyze-task for this request.
```

## Analyze Approval Gate

`analyze-task` is an approval gate.

For any prompt that says `use analyze-task skill`, Codex must:

1. run only the analysis workflow;
2. output the analysis result;
3. stop and wait for explicit owner approval.

Codex may continue into implementation only when the user explicitly approves it with wording such as:

- "implement it";
- "proceed";
- "apply the change";
- "edit the files";
- "continue with write-frontend";
- "approved".

## Search Discipline Rule

Codex must not inspect large unrelated folders just to understand the project.

Codex should stop searching once enough context exists to safely complete the selected skill.

If context is insufficient, Codex should ask a specific clarification or state the limitation instead of crawling unrelated files.

## Frontend Structure

Keep application code under `src`. Keep `src/app` focused on Next.js App Router files and shared frontend code under `src/modules/common`.

```text
src/
  app/
  docs/
  modules/
    common/
      components/
      hooks/
      constants/
      api/
      actions/
      state/
      utils/
    module-name/
      hooks/
      components/
      api/
      actions/
      state/
      types/
```

Use `src/modules/common/components` for reusable UI primitives, `src/modules/common/hooks` for reusable hooks, `src/modules/common/constants` for shared constants, `src/modules/common/api` for shared API clients/helpers, `src/modules/common/actions` for shared server actions, `src/modules/common/state` for shared state, and `src/modules/common/utils` for shared pure utilities. For feature-specific code, create folders under `src/modules/<module-name>` and keep the same internal folders when they are needed.

## Design System

Use the CSS variables in `src/app/globals.css` for day/night theme tokens. Build shared UI with the primitives in `src/modules/common/components` before adding feature-specific components.

## Human Owner Responsibility

The human owner keeps responsibility for final architecture decisions, product behavior, security-sensitive decisions, accepting or rejecting Codex output, and final merge approval.
