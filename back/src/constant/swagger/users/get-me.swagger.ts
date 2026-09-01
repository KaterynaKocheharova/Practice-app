import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { AUTH_COOKIE_NAMES } from 'src/modules/auth/constants';
import {
  UserAuthProvider,
  UserRole,
  UserStatus,
} from 'src/modules/users/enums';

export const GET_ME_SWAGGER = {
  TAG: 'Users',
  SUMMARY: 'Get current user',
  DESCRIPTION:
    'Returns the authenticated user loaded from the access token cookie.',
  COOKIE_AUTH_NAME: AUTH_COOKIE_NAMES.ACCESS_TOKEN,
  OK_RESPONSE_DESCRIPTION: 'Authenticated user data.',
  OK_RESPONSE_EXAMPLE: {
    id: '9d7a297a-2d77-46f9-9b1e-e02f4af24c64',
    name: 'Jane Doe',
    email: 'user@example.com',
    authProvider: UserAuthProvider.Local,
    googleId: null,
    role: UserRole.Student,
    status: UserStatus.Active,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  },
  UNAUTHORIZED_RESPONSE_DESCRIPTION:
    'Returned when the access token cookie is missing, invalid, expired, or no longer belongs to an active user.',
  UNAUTHORIZED_RESPONSE_EXAMPLE: {
    success: false,
    statusCode: 401,
    errorCode: ERROR_CODE.INVALID_ACCESS_TOKEN,
    message: 'Invalid access token.',
    path: '/users/me',
    timestamp: '2026-09-01T00:00:00.000Z',
  },
} as const;
