/** Session cookies the backend issues; this app re-sets them on its own domain. */
export enum AuthCookie {
  AccessToken = "accessToken",
  RefreshToken = "refreshToken",
}

export enum AuthQueryParam {
  Code = "code",
  Error = "error",
  OAuthError = "oauthError",
}

/** Error codes the backend's Google callback forwards to this app. */
export enum GoogleOAuthErrorCode {
  ManagedAccountExists = "USER_WITH_EMAIL_ALREADY_EXISTS",
}

export enum UserRole {
  Teacher = "teacher",
  Student = "student",
}

export enum UserStatus {
  Active = "active",
  Invited = "invited",
  Managed = "managed",
  Onboarding = "onboarding",
  VerificationInProgress = "verification_in_progress",
}

export enum RefreshOutcome {
  Refreshed = "refreshed",
  Rejected = "rejected",
  Unavailable = "unavailable",
}
