# Frontend Structure

This frontend keeps Next.js routing separate from reusable and feature-specific application code.

## Root Layout

```text
src/
  app/
  docs/
  modules/
    common/
      common.config.ts
      common.enums.ts
      components/
      hooks/
      constants/
      api/
      actions/
      state/
      utils/
    module-name/
      module-name.config.ts
      module-name.enums.ts
      hooks/
      components/
      api/
      actions/
      state/
      types/
```

## Folder Roles

Use `src/app/` for Next.js App Router files such as routes, layouts, pages, loading states, error boundaries, and route handlers.

Use `src/modules/common/` for code shared by multiple feature modules:

- `hooks/`: reusable React hooks.
- `components/`: reusable UI primitives.
- `constants/`: shared constants and static configuration values. Name exported static constants and config objects in `UPPER_SNAKE_CASE`. Prefer one uppercase exported config object per module, such as `AUTH_CONFIG = { cookies: {}, fields: {}, queryKeys: {} }`, instead of scattered constants. Endpoints/path maps and user-facing error messages may stay in dedicated constants.
- `api/`: shared API clients, request helpers, and transport utilities.
- `actions/`: shared Next server actions.
- `state/`: shared state stores, providers, selectors, and state helpers.
- `utils/`: shared pure utilities.

Use `src/modules/<module-name>/` for feature-owned code:

- `components/`: components used by that feature.
- `hooks/`: hooks scoped to that feature.
- `api/`: API helpers scoped to that feature.
- `actions/`: Next server actions scoped to that feature.
- `state/`: state scoped to that feature.
- `types/`: types scoped to that feature.

## Component File Layout

Reusable components with child components should use one folder per component, with colocated implementation details:

```text
component-name/
  component-name.tsx
  style.ts
  types.ts
  constants.ts
  child-component/
    child-component.tsx
    style.ts
    types.ts
```