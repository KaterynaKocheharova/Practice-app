import { APP_ROUTES } from "@/modules/common/constants";
import { AuthCookie, AuthQueryParam, UserRole } from "./auth.enums";

interface AuthConfig {
  cookies: {
    accessToken: AuthCookie.AccessToken;
    refreshToken: AuthCookie.RefreshToken;
  };
  googleOAuth: {
    codeParam: AuthQueryParam.Code;
    callbackErrorParam: AuthQueryParam.Error;
    errorParam: AuthQueryParam.OAuthError;
  };
  session: {
    /** Refresh this many seconds before the access token expires. */
    refreshLeewaySeconds: number;
  };
  roleHomeRoutes: Record<UserRole, string>;
}

export const AUTH_CONFIG: AuthConfig = {
  cookies: {
    accessToken: AuthCookie.AccessToken,
    refreshToken: AuthCookie.RefreshToken,
  },
  googleOAuth: {
    codeParam: AuthQueryParam.Code,
    callbackErrorParam: AuthQueryParam.Error,
    errorParam: AuthQueryParam.OAuthError,
  },
  session: {
    refreshLeewaySeconds: 30,
  },
  roleHomeRoutes: {
    [UserRole.Student]: APP_ROUTES.COURSES,
    [UserRole.Teacher]: APP_ROUTES.STUDENTS,
  },
};
