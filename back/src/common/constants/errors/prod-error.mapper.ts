import { ERROR_CODE, ErrorCode } from './error-code.constant';

export const prodErrorMapper: Record<ErrorCode, string> = {
  [ERROR_CODE.INTERNAL_SERVER_ERROR]: 'Something went wrong.',
  [ERROR_CODE.DATABASE_ERROR]: 'A database error occurred.',
  [ERROR_CODE.DATABASE_UNIQUE_CONSTRAINT]: 'Already exists error.',
  [ERROR_CODE.DATABASE_FOREIGN_KEY_CONSTRAINT]:
    'The referenced resource is invalid.',
  [ERROR_CODE.DATABASE_NOT_NULL_CONSTRAINT]: 'Required data is missing.',
  [ERROR_CODE.DATABASE_INVALID_TEXT_REPRESENTATION]: 'Invalid data format.',
};
