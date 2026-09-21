---
name: write-swagger
description: Add or update NestJS Swagger/OpenAPI docs for backend endpoints — controller decorators, DTO metadata, response/auth docs, and constants under src/constant/swagger. Use only when asked.
---

# Write Swagger

Document endpoints accurately without changing runtime behavior, after the behavior exists. Swagger is not fully wired in `src/main.ts` yet.

## Constants

Reusable Swagger text (tags, summaries, descriptions, auth names, response descriptions, shared schema text) lives in `as const` objects under `src/constant/swagger/` (keep this path unless the owner renames it), in `src/constant/swagger/<controller-name>/` per controller/domain. No magic strings in decorators for reused or endpoint-documenting values. Import from concrete files.

## Rules

- Inspect the controller first; DTOs, services, repositories, guards, filters only to verify behavior.
- Protected routes: `@ApiBearerAuth()` plus relevant auth error responses.
- DTO fields in the API surface: `@ApiProperty()` / `@ApiPropertyOptional()`; hide sensitive fields.
- Document expected business and auth errors; skip generic `500` unless asked. For reusable system errors, verify the `ERROR_CODE` and dev/prod messages exist in `src/common/constants/errors/`. Error docs stay production-safe.

## Done when

Target endpoints documented and matching behavior; body/params/query and success responses covered; expected errors covered; sensitive fields hidden; text extracted to constants; build passed (or limitation reported).
