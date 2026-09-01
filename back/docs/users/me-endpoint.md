# Current User Endpoint

The users module exposes the current authenticated user's public profile fields.

## Route

```txt
GET /users/me
```

Response body:

```ts
{
  name: string;
  email: string;
  role: UserRole;
}
```

## Flow

```mermaid
flowchart TD
  Request["request with accessToken cookie"] --> Guard["JwtAccessGuard"]
  Guard --> Token["verify access JWT"]
  Token --> Lookup["UsersService.getCurrentUserDataById()"]
  Lookup --> Repository["UsersRepository.getCurrentUserDataById()"]
  Repository --> Validate["validate email match and active status"]
  Validate --> Controller["UsersController.getMe()"]
  Controller --> Response["name, email, role"]
```

## Behavior

- Requires a valid `accessToken` cookie.
- Loads only `name`, `email`, `role`, and `status` from the database.
- Uses `status` only for guard validation.
- Returns only `name`, `email`, and `role`.
- Rejects missing, invalid, expired, or inactive-user access tokens with `INVALID_ACCESS_TOKEN`.

## Implementation Files

- `src/modules/users/controllers/users.controller.ts`
- `src/modules/users/services/users.service.ts`
- `src/modules/users/repositories/users.repository.ts`
- `src/common/auth/guards/jwt-access.guard.ts`
