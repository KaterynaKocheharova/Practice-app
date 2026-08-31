import { HttpStatus } from '@nestjs/common';

import {
  DATABASE_ERROR_CODE,
  type DatabaseErrorCode,
} from './error-code.constant';

export const databaseHttpStatusMapper: Record<DatabaseErrorCode, HttpStatus> = {
  [DATABASE_ERROR_CODE.DATABASE_ERROR]: HttpStatus.BAD_REQUEST,
  [DATABASE_ERROR_CODE.DATABASE_UNIQUE_CONSTRAINT]: HttpStatus.CONFLICT,
  [DATABASE_ERROR_CODE.DATABASE_FOREIGN_KEY_CONSTRAINT]: HttpStatus.BAD_REQUEST,
  [DATABASE_ERROR_CODE.DATABASE_NOT_NULL_CONSTRAINT]: HttpStatus.BAD_REQUEST,
  [DATABASE_ERROR_CODE.DATABASE_INVALID_TEXT_REPRESENTATION]:
    HttpStatus.BAD_REQUEST,
};
