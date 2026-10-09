import {
  DATABASE_ERROR_CODE,
  ERROR_CODE,
  ErrorCode,
} from './error-code.constant';

export const prodErrorMapper: Record<ErrorCode, string> = {
  [ERROR_CODE.INTERNAL_SERVER_ERROR]: 'Something went wrong.',
  [DATABASE_ERROR_CODE.DATABASE_ERROR]: 'A database error occurred.',
  [DATABASE_ERROR_CODE.DATABASE_UNIQUE_CONSTRAINT]: 'Already exists error.',
  [DATABASE_ERROR_CODE.DATABASE_FOREIGN_KEY_CONSTRAINT]:
    'The referenced resource is invalid.',
  [DATABASE_ERROR_CODE.DATABASE_NOT_NULL_CONSTRAINT]:
    'Required data is missing.',
  [DATABASE_ERROR_CODE.DATABASE_INVALID_TEXT_REPRESENTATION]:
    'Invalid data format.',
  [ERROR_CODE.USER_WITH_EMAIL_ALREADY_EXISTS]:
    'User with this email already exists.',
  [ERROR_CODE.INVALID_CREDENTIALS]: 'Invalid email or password.',
  [ERROR_CODE.INVALID_SIGNUP_VERIFICATION_TOKEN]:
    'Invalid sign-up verification token.',
  [ERROR_CODE.INVALID_SIGNIN_VERIFICATION_TOKEN]:
    'Invalid sign-in verification token.',
  [ERROR_CODE.INVALID_ACCESS_TOKEN]: 'Invalid access token.',
  [ERROR_CODE.INVALID_REFRESH_TOKEN]: 'Invalid refresh token.',
  [ERROR_CODE.PASSWORDS_MUST_BE_DIFFERENT]:
    'New password must be different from current password.',
  [ERROR_CODE.SIGNUP_VERIFICATION_NOT_ALLOWED]:
    'Sign-up verification is not allowed for this user.',
  [ERROR_CODE.SIGNIN_VERIFICATION_NOT_ALLOWED]:
    'Sign-in verification is not allowed for this user.',
  [ERROR_CODE.INVALID_GOOGLE_OAUTH_STATE]: 'Invalid Google OAuth state.',
  [ERROR_CODE.INVALID_GOOGLE_OAUTH_CODE]: 'Invalid Google OAuth code.',
  [ERROR_CODE.GOOGLE_EMAIL_NOT_VERIFIED]: 'Google email is not verified.',
  [ERROR_CODE.GOOGLE_ACCOUNT_NOT_FOUND]:
    'No account is linked to this Google profile.',
  [ERROR_CODE.GOOGLE_ACCOUNT_CONFLICT]:
    'Google account is already linked to another user.',
  [ERROR_CODE.TEACHER_NOT_FOUND]: 'Teacher was not found.',
  [ERROR_CODE.FORBIDDEN]: 'Error',
  [ERROR_CODE.STUDENT_NOT_FOUND]: 'Student was not found.',
  [ERROR_CODE.STUDENT_LANGUAGE_COURSE_ALREADY_EXISTS]:
    'This student already has a course in this language.',
  [ERROR_CODE.STUDENT_LANGUAGE_COURSE_NOT_FOUND]: 'Course was not found.',
  [ERROR_CODE.STUDENT_NOT_EDITABLE]: 'This student can no longer be edited.',
  [ERROR_CODE.STUDENT_EMAIL_NOT_EDITABLE]: 'Email cannot be changed.',
  [ERROR_CODE.EMPTY_UPDATE_BODY]: 'Nothing to update.',
  [ERROR_CODE.MEDIA_ASSET_NOT_FOUND]: 'Upload was not found.',
  [ERROR_CODE.MEDIA_ASSET_UPLOAD_INVALID]:
    'File upload failed. Please try again.',
  [ERROR_CODE.COURSE_DOCUMENT_NOT_FOUND]: 'Document was not found.',
  [ERROR_CODE.COURSE_DOCUMENT_DELETE_FORBIDDEN]:
    'You can only delete documents you added.',
  [ERROR_CODE.COURSE_DOCUMENTS_LIMIT_REACHED]:
    'This course already has the maximum number of documents.',
};
