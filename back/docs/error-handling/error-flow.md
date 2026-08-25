# Error Handling Flow

## Global Flow

All HTTP errors are formatted by `GlobalExceptionFilter`.

Flow:

```txt
HttpException or unknown error
-> GlobalExceptionFilter
-> resolve errorCode
-> choose dev/prod message
-> return unified error response
```

Response shape:

```ts
{
  success: false,
  statusCode: number,
  errorCode: string,
  message: string,
  path: string,
  timestamp: string,
  details?: unknown
}
```

Production uses safe messages from `prod-error.mapper.ts`.
Non-production uses developer messages from `dev-error.mapper.ts`.

## Database Flow

Database errors are handled at repository boundaries with `@HandleDatabaseError()`.

Flow:

```txt
Repository method
-> @HandleDatabaseError()
-> raw PostgreSQL error
-> DatabaseErrorMapper
-> HttpException with errorCode
-> GlobalExceptionFilter
-> dev/prod response
```

Example:

```ts
@HandleDatabaseError()
async createUser(...) {
  return this.database.insert(...);
}
```

PostgreSQL error codes are mapped in `database-error.mapper.ts`.
HTTP statuses for database errors are mapped in `database-http-status.mapper.ts`.

## Rule

Use `@HandleDatabaseError()` on async repository methods that execute database queries.

Do not map database errors in controllers or services. Controllers and services should let repository errors bubble up to the global filter.
