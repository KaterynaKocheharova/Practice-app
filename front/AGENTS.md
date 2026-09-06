<!-- BEGIN:nextjs-agent-rules -->

## Frontend Structure

Keep shared frontend code under `common`; keep `app` focused on Next.js App Router files.

```text
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

Use `common/hooks` for reusable hooks, `common/constants` for shared constants, `common/api` for shared API clients/helpers, `common/actions` for shared server/client actions, and `common/state` for shared state. For feature-specific code, create folders under `modules/<module-name>` and keep the same internal folders when they are needed.
