export const ERRORS = {
  API: {
    CANNOT_RESOLVE_SERVER_API_URL:
      "Cannot resolve server API URL without a request host.",
    FAILED_TO_FETCH_CURRENT_USER: "Failed to fetch current user.",
  },
  AUTH: {
    EMAIL_ALREADY_EXISTS: "An account with this email already exists.",
    GOOGLE_SIGN_IN_FAILED: "Unable to sign in with Google.",
    GOOGLE_SIGN_UP_FAILED: "Unable to sign up with Google.",
    SIGN_IN_FAILED: "Unable to sign in.",
    SIGN_UP_FAILED: "Unable to sign up.",
  },
  STUDENTS: {
    CREATE_FAILED: "Unable to create the student.",
    EMAIL_ALREADY_EXISTS: "A user with this email already exists.",
    LOAD_FAILED: "Unable to load students.",
  },
  VALIDATION: {
    BIRTH_DATE_INVALID: "Enter a valid date.",
    EMAIL_INVALID: "Enter a valid email address.",
    EMAIL_MAX_LENGTH: "Email must be at most 255 characters long.",
    HOBBIES_MAX_COUNT: "Add at most 20 hobbies.",
    HOBBY_MAX_LENGTH: "Each hobby must be at most 100 characters long.",
    JOB_MAX_LENGTH: "Job must be at most 255 characters long.",
    NAME_MAX_LENGTH: "Name must be at most 255 characters long.",
    NAME_REQUIRED: "Enter a name.",
    NAME_MIN_LENGTH: "Name must be at least 2 characters long.",
    PASSWORD_REQUIRED: "Enter your password.",
    PASSWORD_MIN_LENGTH: "Password must be at least 8 characters long.",
    PASSWORD_REQUIRES_LETTER: "Password must contain at least one letter.",
    PASSWORD_REQUIRES_NUMBER: "Password must contain at least one number.",
    PASSWORD_REQUIRES_SPECIAL:
      "Password must contain at least one special character.",
  },
} as const;
