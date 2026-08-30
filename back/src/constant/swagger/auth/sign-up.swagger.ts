import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { AUTH_RESPONSE } from 'src/common/constants/messages/responses';
import { UserRole } from 'src/modules/users/enums';

export const AUTH_SWAGGER = {
  TAG: 'Auth',
  SIGN_UP: {
    SUMMARY: 'Create a sign-up request',
    DESCRIPTION:
      'Creates a local user or reuses a pending verification record, then queues the verification email.',
    REQUEST_BODY_DESCRIPTION:
      'Email, password, name, and role for the sign-up request.',
    CREATED_RESPONSE_DESCRIPTION: AUTH_RESPONSE.SIGN_UP_ACCEPTED_MESSAGE,
    CREATED_RESPONSE_EXAMPLE: {
      message: AUTH_RESPONSE.SIGN_UP_ACCEPTED_MESSAGE,
      email: 'user@example.com',
    },
    BODY: {
      EMAIL: {
        EXAMPLE: 'user@example.com',
        DESCRIPTION: 'Unique email address for the account.',
        FORMAT: 'email',
      },
      PASSWORD: {
        EXAMPLE: 'StrongPass123',
        DESCRIPTION: 'Account password with at least 8 characters.',
        MIN_LENGTH: 8,
        WRITE_ONLY: true,
      },
      NAME: {
        EXAMPLE: 'Jane Doe',
        DESCRIPTION: 'Display name for the account.',
      },
      ROLE: {
        DESCRIPTION: 'Role assigned at sign-up.',
        ENUM: UserRole,
        EXAMPLE: UserRole.Student,
      },
    },
    CONFLICT_RESPONSE_DESCRIPTION:
      'Returned when an active user already exists for the email address.',
    CONFLICT_RESPONSE_EXAMPLE: {
      success: false,
      statusCode: 409,
      errorCode: ERROR_CODE.USER_WITH_EMAIL_ALREADY_EXISTS,
      message: 'User with this email already exists.',
      path: '/auth/sign-up',
      timestamp: '2026-08-30T00:00:00.000Z',
    },
  },
} as const;
