---
name: write-swagger-docs
description: Add and maintain NestJS Swagger documentation, Swagger setup, decorators, DTO metadata, and Swagger schema constants under src/constants/swagger/schema for backend modules.
---

# Swagger Docs Skill

Use this skill for Swagger-only backend documentation changes and for extracting Swagger schema constants.

## Scope

Work on:

- Swagger setup in `src/main.ts`;
- controller Swagger decorators;
- DTO Swagger property decorators;
- Swagger schema constants under `src/constants/swagger/schema/`;
- Swagger documentation consistency for existing endpoints.

Do not change runtime business behavior unless the human owner explicitly asks.

## Constants

Store Swagger constants in:

```txt
src/constants/swagger/schema/
```

Prefer module-specific files:

```txt
src/constants/swagger/schema/<module-name>.swagger-schema.ts
```

Use exported `as const` objects for tags, summaries, descriptions, auth names, response descriptions, and shared schema text.

## Decorators

For protected routes, include:

```ts
@ApiBearerAuth(...)
@ApiUnauthorizedResponse(...)
```

For endpoint documentation, include:

```ts
@ApiOperation(...)
@ApiOkResponse(...)
```

For DTO fields, use `@ApiProperty()` and `@ApiPropertyOptional()`.

Do not add class-validator decorators as part of Swagger-only work.

## Validation

- Run `npm run build` when TypeScript files changed.
- Do not run tests for Swagger-only changes unless runtime behavior changed or the human explicitly asks.
