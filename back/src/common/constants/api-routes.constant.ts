export const API_ROUTES = {
  AUTH: {
    ROOT: 'auth',
    SIGN_UP: 'sign-up',
    SIGN_IN: 'sign-in',
    VERIFY_SIGNUP: 'verify-signup',
    VERIFY_SIGNIN: 'verify-signin',
    REFRESH: 'refresh',
    LOGOUT: 'logout',
    CHANGE_PASSWORD: 'change-password',
    GOOGLE_SIGN_IN: 'google/sign-in',
    GOOGLE_SIGN_UP: 'google/sign-up',
    GOOGLE_CALLBACK: 'google/callback',
  },
  USERS: {
    ROOT: 'users',
    ME: 'me',
  },
} as const;
