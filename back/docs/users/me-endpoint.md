# Current User Endpoint

The users module exposes the current authenticated user's public profile fields.

## Route

```txt
GET /users/me
```

Response body:

```ts
{
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: UserRole | null; // null until onboarding is completed
}
```

## Flow

```mermaid
flowchart TD
  Request["request with accessToken cookie"] --> Guard["JwtOnboardingAccessGuard"]
  Guard --> Token["verify access JWT"]
  Token --> Lookup["UsersService.getCurrentUserDataById()"]
  Lookup --> Repository["UsersRepository.getCurrentUserDataById()"]
  Repository --> Validate["guard: email matches token, status active or onboarding"]
  Validate --> Controller["UsersController.getMe()"]
  Controller --> Response["id, name, email, avatarUrl, role"]
```

## Behavior

- Requires a valid `accessToken` cookie.
- Uses `JwtOnboardingAccessGuard`, so users who have not finished onboarding (`status = onboarding`, `role = null`) can call it too. Most other endpoints use `JwtAccessGuard`, which answers them with `403 ONBOARDING_REQUIRED`.
- Loads only `id`, `name`, `email`, `avatarUrl`, `role`, and `status` from the database.
- Uses `status` only for guard validation.
- Returns `id`, `name`, `email`, `avatarUrl`, and `role` (the same object the guard puts on `request.user`; other controllers read the caller id from it).
- Rejects missing, invalid or expired tokens, and users whose status is not `active` or `onboarding`, with `INVALID_ACCESS_TOKEN`.

## Implementation Files

- `src/modules/users/controllers/users.controller.ts`
- `src/modules/users/services/users.service.ts`
- `src/modules/users/repositories/users.repository.ts`
- `src/common/auth/guards/jwt-user.guard.ts` (shared base)
- `src/common/auth/guards/jwt-onboarding-access.guard.ts`
- `src/common/auth/guards/jwt-access.guard.ts`
