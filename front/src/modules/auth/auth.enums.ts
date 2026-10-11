export enum AuthAutoComplete {
  CurrentPassword = "current-password",
  Email = "email",
  Name = "name",
  NewPassword = "new-password",
}

/** Session cookies the backend issues; this app re-sets them on its own domain. */
export enum AuthCookie {
  AccessToken = "accessToken",
  RefreshToken = "refreshToken",
}

export enum AuthQueryParam {
  Code = "code",
  OAuthError = "oauthError",
  Role = "role",
}

export enum AuthErrorCode {
  EmailAlreadyExists = "USER_WITH_EMAIL_ALREADY_EXISTS",
}

export enum AuthFormField {
  Email = "email",
  Name = "name",
  Password = "password",
  Role = "role",
  Root = "root",
}

export enum AuthFormFieldId {
  Email = "email",
  EmailError = "email-error",
  Name = "name",
  NameError = "name-error",
  Password = "password",
  PasswordError = "password-error",
  Role = "role",
  RoleError = "role-error",
}

export enum AuthInputType {
  Email = "email",
  Password = "password",
  Text = "text",
}

export enum UserRole {
  Teacher = "teacher",
  Student = "student",
}

export enum UserStatus {
  Active = "active",
  Invited = "invited",
  Managed = "managed",
  VerificationInProgress = "verification_in_progress",
}

/** Rejected: the refresh token is no good (sign out). Unavailable: try again later. */
export enum RefreshOutcome {
  Refreshed = "refreshed",
  Rejected = "rejected",
  Unavailable = "unavailable",
}
