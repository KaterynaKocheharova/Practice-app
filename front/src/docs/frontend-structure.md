# Frontend Structure

This frontend keeps Next.js routing separate from reusable and feature-specific application code.

## Root Layout

```text
src/
  app/
  docs/
  modules/
    common/
      components/
      hooks/
      constants/
      api/
      actions/
      state/
      utils/
    module-name/
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
- `constants/`: shared constants and static configuration values.
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

Use this layout when a component has meaningful subparts, local constants, prop types, or conditional style composition. Keep `types.ts` beside the component that owns those props, and keep Tailwind strings in the nearest `style.ts`.


## Rules

- Replace `module-name` with the actual feature name.
- Use lowercase kebab-case for module folder names.
- Create only folders that are needed by the current feature.
- Move code to `src/modules/common/` only after it is reused by more than one module or is clearly cross-cutting.
- Keep feature-specific implementation details inside the owning module.
- Keep `src/app/` thin: compose pages from module code instead of placing large feature implementations directly in route files.
