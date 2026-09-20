# Change Password Endpoint

The auth module lets an authenticated local user replace their password.

## Route

```txt
POST /auth/change-password
```

The endpoint returns `204 No Content`.

## Request Body

```ts
{
  currentPassword: string;
  newPassword: string;
}
```

## Flow

```mermaid
flowchart TD
  Request["request with accessToken cookie"] --> Guard["JwtAccessGuard"]
  Guard --> Controller["AuthController.changePassword()"]
  Controller --> Service["AuthService.changePassword()"]
  Service --> Change["ChangePasswordService.changePassword()"]
  Change --> Lookup["UsersService.getUserAuthVerificationDataByEmail()"]
  Lookup --> Repository["UsersRepository.getUserAuthVerificationDataByEmail()"]
  Repository --> Validate["validate local provider, active status, and current password"]
  Validate --> Hash["hash new password"]
  Hash --> Update["UsersService.updateUserById()"]
  Update --> Revoke["AuthSessionService.revokeSessionsByUserId()"]
  Revoke --> Clear["clear accessToken and refreshToken cookies"]
  Clear --> Response["204 No Content"]
```
