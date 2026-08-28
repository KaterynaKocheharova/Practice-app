---
name: write-backend
description: Implement and maintain production backend code within the approved scope, following this repository's module architecture, layering, naming, validation, and testing rules.
---

# Backend Skill

# Core Mission

Create, update, and maintain backend production code according to:

- approved task scope;
- task-intake handoff when available;
- explicit human owner instructions;
- existing project architecture;
- existing repository conventions;
- module structure policy;
- MVP principles.

---

# Module Structure Rules

Backend modules must live under:

```txt
src/modules/
```

Authoritative module structure:

```txt
src/modules/
|-- index.ts
`-- <module-name>/
    |-- <module-name>.module.ts
    |-- controllers/
    |   |-- index.ts
    |   `-- <module-name>.controller.ts
    |-- services/
    |   |-- index.ts
    |   `-- <module-name>.service.ts
    |-- repositories/
    |   `-- index.ts
    |-- dto/
    |   `-- index.ts
    `-- tests/
        `-- index.ts
```

Optional module-owned folders when needed:

```txt
src/modules/<module-name>/
|-- types/
|   `-- index.ts
`-- enums/
    `-- index.ts
```

Module structure rules:

- use lowercase kebab-case for module folders;
- keep file names aligned with the module name;
- maintain `src/modules/index.ts`;
- maintain local barrels for created module layers;
- use direct imports for shared infrastructure, constants, helpers, config, and shared types;
- do not create test spec files.
- extract all controller endpoints and dynamic route params into constants under `src/constants/endpoints/<module-name>/`.

If a layer is not used yet, keep the folder with `index.ts`.

Examples:

```txt
If no repository exists yet, keep repositories/index.ts.
If no DTO exists yet, keep dto/index.ts.
If no test files exist yet, keep tests/index.ts only.
```
---

# Dependecy Direction Rules

Correct dependency direction:

```txt
Controller -> Service -> Repository
```

---

# Controller

Controllers must:
- act as HTTP entrypoints;
- delegate work to services;
- return responses.

---

# Service

Services must:

- Encapsulate Business Logic: Contain core application and business rules.

- Orchestrate Use Cases: Coordinate the flow of application operations from input to output.

- Coordinate Repositories: Manage data persistence operations by interacting with one or more repositories.

- Follow the Single Responsibility Principle (SRP): Favor many small, focused services over one monolithic service.

- Refactor Large Methods: Split a service into a separate injectable sub-service if an outer method grows too large or contains numerous calls to helper methods that aren't shared elsewhere in the class.

- Implement Existing Interfaces: Conform to existing interfaces when creating similar services, supporting the Open-Closed Principle (OCP) for easy extensibility.

Also, avoid having validation in the service, delegate as much as possible to the dto.

---

# Utils must

- Be classes (NumberFormatter, StringFormatter, DateFormatter, HashCalculator etc.)
- Ahere to the Rule of Three: Be extracted only after a piece of logic has proven its reusability across multiple places, preventing premature abstraction.
- Live inside src/common
- Each time a new util mini-method is added, available util classes should be checked first

---

# Repository Rules

- Select Specific Fields: Always explicitly select only the required fields rather than pulling entire entities or all columns.

- Avoid Dynamic Select Extensions: Never dynamically extend existing select queries based on optional flags. If a new combination of fields is required, extract a dedicated, separate method for that specific select case.

- Centralize Common Queries: Extract all shared selects, projections, and filters into constants located within a dedicated module (e.g., module/constants/repository).

---

# DTO Rules

DTOs must:

- define request and response transport contracts;
- hide sensitive fields;
- perform validation with `class-validator` decorators;
- keep validation in DTOs rather than services or controllers;
- ensure Nest `ValidationPipe` is configured when request DTO validation is introduced.

---

# Type, Interface, Enum, And Constant Rules

Use interfaces where possible.

Use clear and consistent names for data shapes.

For Drizzle repository insert/select contracts, prefer inferred schema types:

```ts
export type CreateUserData = typeof users.$inferInsert;
export type UserData = typeof users.$inferSelect;
```

Use explicit DTO classes and explicit service/API response types when the shape is not a direct database row, when validation is needed, or when sensitive fields must be hidden.

When two shapes represent different stages of the same data, name that difference explicitly.

Example:

```ts
interface RawPostsData {
  // External API shape.
}

interface PostsData {
  // Normalized internal shape.
}
```

All constants should be kept in a dedicated config object:

```ts

export const CatsModuleConfigs = {
  CATS_PER_RAGE: 5,
  POLL_CATS_DELAY: 1000
}
```

Avoid magic strings and magic numbers, resort to constants and enums.

Do not extract obvious one-off literal values that are clearer inline, such as simple boolean flags or local loop counters.

Endpoint constants must live under:

```txt
src/constants/endpoints/<module-name>/
```

Message constants must live under:

```txt
src/constants/messages/<module-name>/error/
src/constants/messages/<module-name>/success/
```

Swagger schema constants must live under:

```txt
src/constants/swagger/schema/
```

---

# Entity And Persistence Rules

When persistence is involved:

- do not invent migrations or persistence behavior;
- ask clarification if transaction or consistency behavior is unclear;
- use transactions when multiple requests to db depend one on another;
- always index foreign_keys;

---

# Security Rules

- do not store secrets or sensitive tokens in plaintext unless explicitly approved;
- do not expose password hashes or refresh token hashes;
- keep safe error messages;
- preserve user or tenant data isolation;
- avoid logging sensitive information;
- always ask for authorization clarification if not stated by task;
- extract dedicated Guards for roles checks;

Stop and ask clarification if security-sensitive behavior is unclear.

---

# Configuration And External Integration Rules

When adding or changing environment variables:

- add the variable to the config service or config schema according to existing project convention;
- add the same variable to `.env.example` in the same backend step;
- use clear names that describe the external system and purpose;
- name API key variables as `<SERVICE>_API_KEY`, not `<SERVICE>_API_TOKEN`.

If an external API integration is required:

- check the official API documentation for an available SDK before implementing raw fetch or HTTP calls;
- prefer an official or maintained SDK when it fits the project and avoids custom protocol handling;
- avoid installing packages that official docs mark as deprecated, legacy, or superseded;
- do not add a new package without explicit approval when the task did not approve new dependencies;

For error logging:

- always log each request to external providers,add logs before, after, parse and log errors
- use official nest.js logger, not console.log

Development-mode diagnostics may use the underlying `error.message` when handled by the approved global error flow.

Production responses must remain user-friendly and must not expose implementation details.

---

# Error Handling Rules

Use the project global error flow:

```txt
PostgreSQL / TypeORM error
-> database mapper
-> NestJS HttpException with errorCode
-> GlobalExceptionFilter
-> environment-specific message
-> unified API error response
```

Production code must:

- use standard NestJS exceptions;
- keep business exception messages production-safe when throwing a message directly;
- prefer `errorCode` for reusable/system/database errors;
- avoid environment branching in controllers, services, repositories, decorators, and mappers;
- let `GlobalExceptionFilter` resolve production/development messages;
- keep response formatting out of controllers, services, repositories, decorators, and mappers;
- use `@HandleDatabaseError()` for async database operations when database errors can occur;
- avoid broad try/catch blocks across repositories/services.
- preserve the original error message for development diagnostics when the global error flow supports it.

When implementation introduces a possible API error:

1. Check `src/constants/messages/<module-name>/error/` for a matching message.
2. If no matching message exists, add it to the module error message constants.
3. Throw standard NestJS exceptions using extracted module error messages.
4. Keep production-facing error messages safe and non-sensitive.

When implementation introduces a success response message:

1. Check `src/constants/messages/<module-name>/success/` for a matching message.
2. If no matching message exists, add it to the module success message constants.
3. Return success messages from the extracted constants.

---

# Swagger Rules

When adding or changing backend HTTP endpoints:

- add or update Swagger decorators in controllers and DTOs;
- add or update Swagger constants under `src/constants/swagger/schema/`;
- use the separate `write-swagger-docs` skill for Swagger-only documentation/schema work;
- run build when Swagger decorators, constants, imports, or setup affect TypeScript code.

---

# New Module Workflow

When creating a new module:

1. Determine module name from the approved scope.
2. Normalize folder name to lowercase kebab-case.
3. Create `src/modules/<module-name>/`.
4. Create `<module-name>.module.ts`.
5. Create `controllers/`.
6. Create `services/`.
7. Create `repositories/`.
8. Create `dto/`.
9. Create `tests/`.
10. Add `index.ts` in each subfolder.
11. Add controller file only when HTTP endpoints are required.
12. Add service file only when service behavior is required.
13. Add repository file only when persistence or data access is required.
14. Add DTO files only when request/response contracts are required.
15. Add `types/` only when the module needs explicit module-owned interfaces or types.
16. Add `enums/` only when the module owns enum values.
17. Export created module files from their local module barrels.
18. Export module from `src/modules/index.ts` when needed.
19. Connect module in `src/app.module.ts` or target parent module.
20. Run build.
21. Run relevant existing tests when available.

Do not create test spec files.

---

# Update Existing Module Workflow

When modifying an existing module:

1. Preserve existing structure and naming conventions.
2. Inspect only relevant files.
3. Add new production files in the correct layer.
4. Update related module barrel exports.
5. Update module providers/controllers/imports/exports.
6. Preserve existing behavior unless the task explicitly changes it.
7. Avoid unrelated refactors.
8. Avoid public API contract changes unless explicitly requested.
9. Do not modify tests.
10. Run build.
11. Run affected existing tests when available.

---

# MVP Implementation Rules

Keep solutions simple.

Prefer:

- explicit services;
- clear controller methods;
- direct DTOs;
- simple repository methods;
- small focused changes;
- predictable NestJS patterns;
- local changes over broad refactors.

Avoid:

- unnecessary base classes;
- unnecessary factories;
- unnecessary generic abstractions;
- unnecessary decorators;
- unnecessary shared helpers;
- premature event-driven flows;
- broad folder restructuring;
- speculative future-proofing;
- new libraries for problems already solved by existing project patterns.

---

# Communication Style

Communicate like a practical but friendly senior backend engineer. 
Always concisely and explicitly list:

- changed production files;
- affected module;
- tests run;
- build result;
- assumptions;
- unresolved issues;
- recommended next step;
- notes for human review.

---
