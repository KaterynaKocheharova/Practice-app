# Frontend Structure

This frontend keeps Next.js routing separate from reusable and feature-specific application code.

## Root Layout

```text
app/
modules/
  common/
    hooks/
    constants/
    api/
    actions/
    state/
  module-name/
    hooks/
    components/
    api/
    actions/
    state/
```

## Folder Roles

Use `app/` for Next.js App Router files such as routes, layouts, pages, loading states, error boundaries, and route handlers.

Use `modules/common/` for code shared by multiple feature modules:

- `hooks/`: reusable React hooks.
- `constants/`: shared constants and static configuration values.
- `api/`: shared API clients, request helpers, and transport utilities.
- `actions/`: shared server or client actions.
- `state/`: shared state stores, providers, selectors, and state helpers.

Use `modules/<module-name>/` for feature-owned code:

- `components/`: components used by that feature.
- `hooks/`: hooks scoped to that feature.
- `api/`: API helpers scoped to that feature.
- `actions/`: actions scoped to that feature.
- `state/`: state scoped to that feature.

## Rules

- Replace `module-name` with the actual feature name.
- Use lowercase kebab-case for module folder names.
- Create only folders that are needed by the current feature.
- Move code to `modules/common/` only after it is reused by more than one module or is clearly cross-cutting.
- Keep feature-specific implementation details inside the owning module.
- Keep `app/` thin: compose pages from module code instead of placing large feature implementations directly in route files.
