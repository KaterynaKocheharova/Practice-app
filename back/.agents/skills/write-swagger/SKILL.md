---
name: write-swagger
description: Create or update accurate Swagger and OpenAPI documentation for backend endpoints using this repository's centralized Swagger constants and security rules.
---

# Write Swagger Skill

# Core Mission

Ensure every new or updated backend endpoint has Swagger / OpenAPI documentation that is:

- complete;
- accurate;
- aligned with the implemented endpoint behavior;
- based on centralized Swagger constants;
- free from magic strings inside Swagger decorators;
- safe from sensitive data exposure.

All Swagger strings must be stored in:

```txt
src/constant/swagger/
```

Swagger documentation must describe actual behavior only.

Do not invent endpoint behavior, response fields, response statuses, auth behavior, validation behavior, or errors.

---

# Swagger Constants Structure

All Swagger constants must follow this structure:

```txt
src/constant/swagger/
в”њв”Ђв”Ђ main/
в”‚   в”њв”Ђв”Ђ meta.ts
в”‚   в””в”Ђв”Ђ tags.ts
в””в”Ђв”Ђ <controller-name>/
    в”њв”Ђв”Ђ operation.ts
    в”њв”Ђв”Ђ response_success.ts
    в””в”Ђв”Ђ response_error.ts
```

The `main/meta.ts` file contains global Swagger constants such as:

```txt
SWAGGER_DOCS_ROUTE
SWAGGER_META
```

The `main/tags.ts` file contains global Swagger tag constants such as:

```txt
SWAGGER_TAG
```

Each controller must have its own Swagger constants folder:

```txt
src/constant/swagger/<controller-name>/
```

Examples:

```txt
src/constant/swagger/auth/
src/constant/swagger/users/
src/constant/swagger/sessions/
src/constant/swagger/order-items/
```

---

# Required Files Per Controller

Each controller-specific Swagger folder must include:

```txt
operation.ts
response_success.ts
response_error.ts
```

## `operation.ts`

Use for endpoint operation summaries.

Example:

```ts
export const SWAGGER_OPERATION = {
  SIGN_IN_SUMMARY: 'Sign in user',
  SIGN_OUT_SUMMARY: 'Sign out current session',
} as const;
```

## `response_success.ts`

Use for successful response descriptions.

Example:

```ts
export const SWAGGER_RESPONSE_SUCCESS = {
  SIGN_IN_SUCCESS: 'User signed in successfully.',
  SIGN_OUT_SUCCESS: 'User signed out successfully.',
} as const;
```

## `response_error.ts`

Use for error response descriptions.

Example:

```ts
export const SWAGGER_RESPONSE_ERROR = {
  INVALID_CREDENTIALS: 'Invalid email or password.',
  UNAUTHORIZED: 'Authentication required.',
  FORBIDDEN: 'Access denied.',
  INTERNAL_ERROR: 'Unexpected server error.',
} as const;
```
---

# Implementation Checklist

Use this checklist when creating or updating Swagger docs:

- [ ] Read task and task-intake handoff when available
- [ ] Inspect target controller method
- [ ] Identify HTTP method and route
- [ ] Identify auth/public status
- [ ] Identify route params
- [ ] Identify query params
- [ ] Identify request body
- [ ] Identify request DTO
- [ ] Identify response DTO if available
- [ ] Identify actual success status
- [ ] Identify actual error statuses
- [ ] Inspect service behavior only if needed
- [ ] Check existing Swagger constants
- [ ] Create or update `operation.ts`
- [ ] Create or update `response_success.ts`
- [ ] Create or update `response_error.ts`
- [ ] Use production-safe error messages only
- [ ] Check that every documented reusable error has an `ERROR_CODE` with production/development messages
- [ ] Import Swagger constants directly from concrete files
- [ ] Add or update `@ApiTags()`
- [ ] Add or update `@ApiOperation()`
- [ ] Add or update success `@ApiResponse()`
- [ ] Add or update error `@ApiResponse()`
- [ ] Add or update schemas for non-trivial requests, responses, and documented errors
- [ ] Add `@ApiParam()` when needed
- [ ] Add `@ApiQuery()` when needed
- [ ] Add `@ApiBody()` when needed
- [ ] Add auth documentation when needed
- [ ] Check that no Swagger decorator contains magic strings
- [ ] Verify Swagger descriptions match implementation
- [ ] Verify sensitive fields are not exposed
- [ ] Run build when relevant and available
- [ ] Report Swagger UI limitation if UI cannot be checked

---

# Validation Checklist

Before finishing, verify:

- [ ] Every target endpoint has Swagger documentation
- [ ] Every changed endpoint has updated Swagger documentation
- [ ] Operation summaries are stored in `operation.ts`
- [ ] Success responses are stored in `response_success.ts`
- [ ] Error responses are stored in `response_error.ts`
- [ ] Controller imports use concrete Swagger constant files
- [ ] No broad Swagger re-export barrel is used
- [ ] No magic strings are used inside Swagger decorators
- [ ] Auth requirements are documented
- [ ] Route params are documented when applicable
- [ ] Query params are documented when applicable
- [ ] Request body is documented when applicable
- [ ] Success responses are documented
- [ ] Relevant error responses are documented
- [ ] Generic `500` errors are not documented
- [ ] Non-trivial requests, responses, and documented errors have schemas
- [ ] Swagger docs match actual implementation
- [ ] Sensitive fields are not exposed
- [ ] Build passed or limitation is reported
- [ ] Swagger UI checked or limitation is reported

---

# Expected Output Format

After completing the work, respond with:

````md
## Swagger Summary

Briefly describe what was documented, updated, or reviewed.

# Communication Style

Communicate like a practical backend engineer.

Responses must be:

- concise;
- structured;
- specific;
- documentation-focused;
- implementation-aware;
- easy to review;
- free from unnecessary theory.
