---
name: write-swagger
description: Add or update NestJS Swagger/OpenAPI documentation for backend endpoints in this repository. Use for Swagger setup, controller decorators, DTO metadata, endpoint response docs, auth docs, and Swagger constants under src/constant/swagger.
---

# Write Swagger Skill

# Core Mission

Document backend endpoints accurately without changing runtime behavior.

Follow `AGENTS.md` for global workflow, search discipline, import/barrel rules, naming, and validation defaults.

Use this skill for Swagger-only changes after backend behavior exists.

---

# Current Project State

Swagger is not fully wired yet in `src/main.ts`.

Swagger constants currently live under:

```txt
src/constant/swagger/
```

Keep using this path unless the human owner asks to rename the shared constants folder.

---

# Swagger Constants Rules

Store reusable Swagger text in concrete constant files under:

```txt
src/constant/swagger/
```

Use controller or domain-specific folders when adding endpoint docs:

```txt
src/constant/swagger/<controller-name>/
```

Use `as const` objects for tags, summaries, descriptions, auth names, response descriptions, and shared schema text.

Avoid magic strings inside Swagger decorators when a value is reused or part of endpoint documentation.

---

# Documentation Rules

Inspect the controller first. Inspect DTOs, services, repositories, guards, and filters only when needed to verify behavior.

For protected routes, document auth with `@ApiBearerAuth()` and relevant auth error responses.

For DTO fields, use `@ApiProperty()` and `@ApiPropertyOptional()` when DTOs are part of the documented API surface.

---

# Error Documentation Rules

Document expected business and auth errors.

Do not document generic `500` responses unless the task explicitly asks for generic server error documentation.

When documenting reusable system errors, verify the related `ERROR_CODE` and dev/prod messages exist under `src/common/constants/errors/`.

Swagger error docs must stay production-safe.
---

# Completion Checklist

Before finishing:

- target endpoints have Swagger docs;
- docs match implemented behavior;
- request body, params, and query values are documented when present;
- success responses are documented;
- expected business/auth errors are documented;
- sensitive fields are hidden;
- reusable Swagger text is extracted to `src/constant/swagger/`;
- imports use concrete files;
- build passed or the limitation is reported.
