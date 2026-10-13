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
JWT_SIGNUP_VERIFICATION_EXPIRES_IN=3600
JWT_ACCESS_SECRET=replace-with-at-least-32-characters
JWT_ACCESS_EXPIRES_IN=900
JWT_REFRESH_SECRET=replace-with-at-least-32-characters
JWT_REFRESH_EXPIRES_IN=604800
FRONTEND_URL=http://localhost:3000

GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3005/auth/google/callback

STORAGE_DRIVER=s3
S3_BUCKET=app-documents
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
S3_ENDPOINT=http://localhost:9000
S3_FORCE_PATH_STYLE=true
```

Add Resend variables when running with `NODE_ENV=production`.

## Auth Variables

`JWT_SIGNUP_VERIFICATION_SECRET` is used to sign signup verification tokens.

Rules:

- Minimum length is 32 characters.
- Keep it private.
- Use the same value when verifying signup tokens later.
- Changing it invalidates existing signup verification links.

`JWT_SIGNUP_VERIFICATION_EXPIRES_IN` is the signup verification token lifetime in seconds.

`JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` sign auth session tokens.

Rules:

- Minimum secret length is 32 characters.
- Use different values for access, refresh, and signup verification secrets.
- Changing a secret invalidates tokens signed with it.

`JWT_ACCESS_EXPIRES_IN` and `JWT_REFRESH_EXPIRES_IN` are token lifetimes in seconds. Cookie expiration is derived from these values.

Generate a local secret with Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

`FRONTEND_URL` is used to build verification links:

```txt
{FRONTEND_URL}/verify-email?token={token}
```

It is also used after successful Google OAuth:

```txt
{FRONTEND_URL}/auth/google/success
```

`GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, and `GOOGLE_OAUTH_REDIRECT_URI` are required for Google OAuth.

`GOOGLE_OAUTH_REDIRECT_URI` must match the backend callback URL configured in Google Cloud OAuth settings:

```txt
{BACKEND_URL}/auth/google/callback
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

## Storage Variables

Object storage for uploaded files (see [storage.md](../infrastructure/storage.md)):

| Variable | Meaning |
|---|---|
| `STORAGE_DRIVER` | Storage implementation. Only `s3` exists. |
| `S3_BUCKET` | Private bucket name. |
| `S3_REGION` | Required by the SDK; MinIO ignores it (`us-east-1`), R2 uses `auto`. |
| `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | Bucket credentials. Locally also MinIO's root login (secret at least 8 characters). |
| `S3_ENDPOINT` | Optional. Set for S3-compatible services (MinIO `http://localhost:9000`, R2 `https://<account-id>.r2.cloudflarestorage.com`); leave unset for AWS. |
| `S3_FORCE_PATH_STYLE` | `true` for MinIO, `false` (default) for AWS and R2. |

`docker-compose.yml` reads `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET` and `FRONTEND_URL` from the same `.env` to configure MinIO. The variables are validated when `StorageModule` starts, so the app does not boot without them.

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
