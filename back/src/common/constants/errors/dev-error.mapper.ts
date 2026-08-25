import { ERROR_CODE, ErrorCode } from './error-code.constant';

export const devErrorMapper: Record<ErrorCode, string> = {
  [ERROR_CODE.INTERNAL_SERVER_ERROR]: 'Internal server error.',
  [ERROR_CODE.DATABASE_ERROR]: 'Database error.',
  [ERROR_CODE.DATABASE_UNIQUE_CONSTRAINT]:
    'Database unique constraint violation.',
  [ERROR_CODE.DATABASE_FOREIGN_KEY_CONSTRAINT]:
    'Database foreign key constraint violation.',
  [ERROR_CODE.DATABASE_NOT_NULL_CONSTRAINT]:
    'Database not-null constraint violation.',
  [ERROR_CODE.DATABASE_INVALID_TEXT_REPRESENTATION]:
    'Database invalid text representation.',
};
