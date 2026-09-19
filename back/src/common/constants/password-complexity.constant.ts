export const PASSWORD_COMPLEXITY = {
  LETTER: {
    PATTERN: /[a-zA-Z]/,
    MESSAGE: 'password must contain at least one letter',
  },
  NUMBER: {
    PATTERN: /[0-9]/,
    MESSAGE: 'password must contain at least one number',
  },
  SPECIAL_CHARACTER: {
    PATTERN: /[^a-zA-Z0-9]/,
    MESSAGE: 'password must contain at least one special character',
  },
} as const;
