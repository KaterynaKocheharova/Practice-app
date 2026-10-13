---
name: write-docs
description: Write or update backend documentation organized by module. Use for module docs, request-to-response flows, endpoint flow diagrams, ERD/entity relationship diagrams, setup notes, and architecture docs under docs/.
---

# Write Docs Skill

Write minimal backend docs that explain how the project works without repeating code.

Follow `AGENTS.md` for global workflow, search discipline, naming, and project structure.

---

# Scope

Use this skill for Markdown docs under:

```txt
docs/
```

Organize docs into subfolders; do not add files at the `docs/` root:

```txt
docs/<module-name>/   # module topics (auth, db, students, media-assets, users, error-handling)
docs/setup/           # local setup and env
docs/infrastructure/  # cross-cutting services (queues, storage)
```

---

# Required Content

Prefer short docs with diagrams over long explanation.

When relevant, include:

- request-to-response flow: `request -> controller -> service -> repository -> db -> response`;
- endpoint flow for each documented endpoint;
- ERD/entity relationship diagrams for database entities;
- important validations, errors, and side effects;
- file paths for the implementation entrypoints.

Use Mermaid for diagrams.

Use `erDiagram` for entity relationships.

Use `flowchart TD` for request, service, repository, and endpoint flows.

---

# Level Of Detail

Document high-level logic only:

- who may do what;
- the flow between layers;
- key decisions and the reasons for them;
- the errors a caller sees.

Do not restate the code: no method-by-method walkthroughs, private helper names, full field lists, or incidental implementation details. A reader who needs those reads the code.

Write one short sentence per point. Prefer a diagram over prose.

---

# Rules

Document actual behavior only.

Inspect code before writing docs.

Keep docs concise and practical.

Do not document planned behavior as implemented behavior.

Update existing docs instead of creating near-duplicates.

Use lowercase kebab-case filenames.

---
