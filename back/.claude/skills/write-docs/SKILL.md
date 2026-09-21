---
name: write-docs
description: Write or update backend docs under docs/ organized by module — request-to-response flows, endpoint flows, ERDs, setup and architecture notes.
---

# Backend Docs

Minimal docs in `docs/` (or `docs/<module-name>/` for module topics) explaining how things work without repeating code. Prefer short docs with diagrams. Update existing docs instead of creating near-duplicates. Lowercase kebab-case filenames.

## Include when relevant

- request-to-response flow: `request -> controller -> service -> repository -> db -> response`
- an endpoint flow per documented endpoint
- ERD for database entities (`erDiagram`)
- important validations, errors, side effects
- file paths of implementation entrypoints

Use Mermaid; `flowchart TD` for request/service/repository/endpoint flows.

## Rules

Inspect the code first; document actual behavior only, never planned behavior.
