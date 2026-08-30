# Backend Environment

The backend reads configuration from `.env` through `@nestjs/config`.

Create the file at:

```txt
back/.env
```

## Local Development Example

```env
DATABASE_URL=postgres://myuser:mypassword@localhost:5432/mydb
NODE_ENV=development
PORT=3005

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=

SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=user
SMTP_PASS=password
SMTP_FROM=no-reply@example.com

JWT_SIGNUP_VERIFICATION_SECRET=replace-with-at-least-32-characters
FRONTEND_URL=http://localhost:3000
```

Add Resend variables when running with `NODE_ENV=production`.

## Auth Variables

`JWT_SIGNUP_VERIFICATION_SECRET` is used to sign signup verification tokens.

Rules:

- Minimum length is 32 characters.
- Keep it private.
- Use the same value when verifying signup tokens later.
- Changing it invalidates existing signup verification links.

Generate a local secret with Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

`FRONTEND_URL` is used to build verification links:

```txt
{FRONTEND_URL}/verify-email?token={token}
```

## Mail Variables

In non-production, the mail module uses SMTP:

```env
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

In production, the mail module uses Resend:

```env
RESEND_API_KEY=
RESEND_FROM=
```

Production mode is selected when:

```env
NODE_ENV=production
```

## Redis Variables

Redis is required for BullMQ queues:

```env
REDIS_HOST=
REDIS_PORT=
REDIS_DB=
REDIS_PASSWORD=
```

`REDIS_PASSWORD` is optional. Leave it empty for local Redis if no password is configured.

## Validation

Environment values are validated when their owning module reads config through `src/common/configs/env-config.ts`.

If a required value is missing or invalid, the app throws:

```txt
Invalid environment configuration: ...
```

## Adding a New Env Variable

1. Add the raw environment variable name to `src/common/configs/env-names.ts`.

Example:

```ts
export const ENV_NAMES = {
  FEATURE_API_KEY: 'FEATURE_API_KEY',
} as const;
```

2. Add or update the matching typed config interface in `src/common/types/env/`.

Example:

```ts
export interface FeatureEnvConfig {
  apiKey: string;
}
```

3. Export the type from `src/common/types/env/index.ts`.

Example:

```ts
export type { FeatureEnvConfig } from './feature-env-config.type';
```

4. Add a Zod schema in `src/common/configs/env-config.schema.ts`.

Example:

```ts
export const featureEnvConfigSchema = z.object({
  apiKey: z.string().min(1),
});
```

Use coercion for values that arrive as strings but should be used as numbers or booleans:

```ts
z.coerce.number().int().min(1)
```

5. Add a getter in `src/common/configs/env-config.ts`.

Example:

```ts
export const getFeatureEnvConfig = (
  configService: ConfigService,
): FeatureEnvConfig =>
  parseEnvConfig(featureEnvConfigSchema, {
    apiKey: configService.get<string>(ENV_NAMES.FEATURE_API_KEY),
  });
```

6. Read the config from the owning module, service, or provider through `ConfigService`.

Example:

```ts
const { apiKey } = getFeatureEnvConfig(this.configService);
```

7. Add the variable to `back/.env`.

Example:

```env
FEATURE_API_KEY=local-value
```

8. Update this doc if the variable is required for local setup.