---
name: write-docs
description: Write or update backend docs under docs/ organized by module — request-to-response flows, endpoint flows, ERDs, setup and architecture notes.
---

# Backend Docs

Minimal docs in subfolders of `docs/` (`<module-name>/` for module topics, `setup/` for local setup and env, `infrastructure/` for queues and storage; nothing at the root) explaining how things work without repeating code. Prefer short docs with diagrams. Update existing docs instead of creating near-duplicates. Lowercase kebab-case filenames.

## Include when relevant

- request-to-response flow: `request -> controller -> service -> repository -> db -> response`
- an endpoint flow per documented endpoint
- ERD for database entities (`erDiagram`)
- important validations, errors, side effects
- file paths of implementation entrypoints

Use Mermaid; `flowchart TD` for request/service/repository/endpoint flows.

## Level of detail

Document high-level logic only: who may do what, the flow between layers, key decisions with their reasons, and the errors a caller sees. Do not restate the code: no method-by-method walkthroughs, private helper names, full field lists or incidental implementation details; a reader who needs those reads the code. One short sentence per point, and a diagram over prose.

## Rules

Inspect the code first; document actual behavior only, never planned behavior.
