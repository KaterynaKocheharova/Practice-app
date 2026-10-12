import {
  DATABASE_ERROR_CODE,
  ERROR_CODE,
  ErrorCode,
} from './error-code.constant';

export const devErrorMapper: Record<ErrorCode, string> = {
  [ERROR_CODE.INTERNAL_SERVER_ERROR]: 'Internal server error.',
  [DATABASE_ERROR_CODE.DATABASE_ERROR]: 'Database error.',
  [DATABASE_ERROR_CODE.DATABASE_UNIQUE_CONSTRAINT]:
    'Database unique constraint violation.',
  [DATABASE_ERROR_CODE.DATABASE_FOREIGN_KEY_CONSTRAINT]:
    'Database foreign key constraint violation.',
  [DATABASE_ERROR_CODE.DATABASE_NOT_NULL_CONSTRAINT]:
    'Database not-null constraint violation.',
  [DATABASE_ERROR_CODE.DATABASE_INVALID_TEXT_REPRESENTATION]:
    'Database invalid text representation.',
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
  [ERROR_CODE.FORBIDDEN]: 'User role is not allowed to access this resource.',
  [ERROR_CODE.STUDENT_NOT_FOUND]:
    'Student was not found or is not managed by this teacher.',
  [ERROR_CODE.STUDENT_LANGUAGE_COURSE_ALREADY_EXISTS]:
    'Student already has a course in this language with this teacher.',
  [ERROR_CODE.STUDENT_LANGUAGE_COURSE_NOT_FOUND]:
    'Course was not found or is not accessible by this user.',
  [ERROR_CODE.STUDENT_NOT_EDITABLE]:
    'Student is no longer managed and cannot be edited by this user.',
  [ERROR_CODE.EMPTY_UPDATE_BODY]:
    'Request body must contain at least one field to update.',
  [ERROR_CODE.MEDIA_ASSET_NOT_FOUND]:
    'Upload was not found, was already used, or belongs to another user.',
  [ERROR_CODE.MEDIA_ASSET_UPLOAD_INVALID]:
    'Uploaded file is missing in storage or does not match the requested size or type.',
  [ERROR_CODE.MEDIA_ASSET_PENDING_LIMIT_REACHED]:
    'Too many uploads are waiting to be attached; attach or let them expire before requesting more.',
  [ERROR_CODE.COURSE_DOCUMENT_NOT_FOUND]:
    'Course document was not found or is not accessible by this user.',
  [ERROR_CODE.COURSE_DOCUMENT_DELETE_FORBIDDEN]:
    'Only the user who added the document can delete it.',
  [ERROR_CODE.COURSE_DOCUMENTS_LIMIT_REACHED]:
    'Course has reached the maximum number of documents.',
};
