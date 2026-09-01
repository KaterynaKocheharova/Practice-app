export const LOGOUT_SWAGGER = {
  SUMMARY: 'Log out',
  DESCRIPTION:
    'Best-effort logout. Attempts to revoke sessions from auth cookies when possible, then clears auth cookies. Token validation failures do not block cookie clearing.',
  NO_CONTENT_RESPONSE_DESCRIPTION:
    'Logout completed. Auth cookies were cleared and the response body is empty.',
} as const;
