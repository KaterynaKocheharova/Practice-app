export const API_ROUTES = {
  AUTH: {
    SIGN_UP: "auth/sign-up",
    SIGN_IN: "auth/sign-in",
    VERIFY_SIGNUP: "auth/verify-signup",
    VERIFY_SIGNIN: "auth/verify-signin",
    REFRESH: "auth/refresh",
    LOGOUT: "auth/logout",
    CHANGE_PASSWORD: "auth/change-password",
    GOOGLE: "auth/google",
  },
  USERS: {
    ME: "users/me",
  },
} as const;
