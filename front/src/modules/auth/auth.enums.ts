export enum AuthAutoComplete {
  CurrentPassword = "current-password",
  Email = "email",
  Name = "name",
  NewPassword = "new-password",
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
