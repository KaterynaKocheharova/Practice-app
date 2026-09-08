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
} as const;

export const signUpFormInputTypes = {
  email: "email",
  hidden: "hidden",
  name: "text",
  password: "password",
} as const;

export const signUpFormAutoComplete = {
  email: "email",
  name: "name",
  password: "new-password",
} as const;
