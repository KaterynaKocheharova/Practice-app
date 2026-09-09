export const signUpFormFields = {
  email: "email",
  name: "name",
  password: "password",
  role: "role",
  root: "root",
} as const;

export const signUpFormFieldIds = {
  email: "email",
  emailError: "email-error",
  name: "name",
  nameError: "name-error",
  password: "password",
  passwordError: "password-error",
  role: "role",
  roleError: "role-error",
} as const;

export const signUpFormInputTypes = {
  email: "email",
  name: "text",
  password: "password",
} as const;

export const signUpFormAutoComplete = {
  email: "email",
  name: "name",
  password: "new-password",
} as const;
