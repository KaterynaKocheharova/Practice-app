# Auth Signup Flow

The auth module owns the `POST /auth/sign-up` flow.

## Route

```txt
POST /auth/sign-up
```

Request body:

```ts
{
  email: string;
  password: string;
  name: string;
  role: UserRole;
}
```

Success response:

```ts
{
  message: string;
  email: string;
}
```

## Module Structure

Main files:

- `src/modules/auth/auth.module.ts`
- `src/modules/auth/controllers/auth.controller.ts`
- `src/modules/auth/services/auth.service.ts`
- `src/modules/auth/services/signup.service.ts`
- `src/modules/auth/services/helpers/auth-verification.service.ts`
- `src/modules/auth/services/helpers/auth-email-queue.service.ts`
- `src/modules/auth/processors/auth-email.processor.ts`
- `src/modules/auth/templates/signup-verification-email.template.ts`
- `src/modules/auth/types/signup.type.ts`

Sign-up-specific types are grouped in `src/modules/auth/types/signup.type.ts`.

## Flow

```txt
AuthController.signUp()
-> AuthService.signUp()
-> SignupService.signUp()
-> UsersService.getUserByEmail()
-> create or update verification-in-progress user
-> AuthVerificationService.createVerificationLink()
-> AuthEmailQueueService.enqueueSignupVerificationEmail()
-> AuthEmailProcessor
-> MailProvider.sendEmail()
```

## Behavior

1. `AuthController` receives and validates `SignUpDto`.

2. `AuthService` delegates the request to `SignupService`.

3. `SignupService` checks whether a user already exists by email.

4. If the existing user is active, the service throws `ConflictException` with `USER_WITH_EMAIL_ALREADY_EXISTS`.

5. If the existing user has `VerificationInProgress` status, the service updates the user's name, role, and password hash.

6. If no user exists, the service creates a local user with `VerificationInProgress` status.

7. `AuthVerificationService` creates a JWT signup verification token and builds a frontend verification URL:

```txt
{FRONTEND_URL}/verify-email?token={token}
```

8. `AuthEmailQueueService` enqueues a signup verification email job on the auth email queue.

9. `AuthEmailProcessor` renders the signup verification email template and sends it through the configured mail provider.

10. The API returns the accepted signup response with the user's email.

## Queue

The auth module registers `QUEUE_NAMES.AUTH_EMAIL`.

Signup verification email jobs use:

```ts
AUTH_EMAIL_JOB_NAMES.SEND_SIGNUP_VERIFICATION
```

Job data shape:

```ts
export interface SignupVerificationEmailJobData {
  email: string;
  name: string;
  verificationLink: string;
}
```

Jobs are retried up to 3 times with exponential backoff and are removed after successful completion.

## Token

Signup verification tokens use:

```ts
export interface SignupVerificationTokenPayload {
  sub: string;
  email: string;
  purpose: SignupVerificationTokenPurpose;
}
```

The token is signed with `JWT_SIGNUP_VERIFICATION_SECRET`.

## Errors

Validation errors are produced by the global `ValidationPipe`.

Known signup conflict:

```ts
{
  errorCode: ERROR_CODE.USER_WITH_EMAIL_ALREADY_EXISTS
}
```

All HTTP errors are formatted by `GlobalExceptionFilter`.
