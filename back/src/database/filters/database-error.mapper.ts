import { HttpException, Injectable } from '@nestjs/common';

import { databaseErrorMapper } from '../../common/constants/errors/database-error.mapper';
import { databaseHttpStatusMapper } from '../../common/constants/errors/database-http-status.mapper';
import { DATABASE_ERROR_CODE } from '../../common/constants/errors/error-code.constant';
import { PostgresError } from '../../common/types/errors/postgres-error.type';

@Injectable()
export class DatabaseErrorMapper {
  map(exception: unknown): HttpException | undefined {
    if (!this.isPostgresError(exception)) {
      return undefined;
    }

    const errorCode =
      databaseErrorMapper[exception.code] ?? DATABASE_ERROR_CODE.DATABASE_ERROR;

    return new HttpException(
      {
        errorCode,
        databaseError: {
          code: exception.code,
          detail: exception.detail,
          constraint: exception.constraint,
          table: exception.table,
        },
      },
      databaseHttpStatusMapper[errorCode],
    );
  }

  private isPostgresError(exception: unknown): exception is PostgresError {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      typeof exception.code === 'string' &&
      ('severity' in exception ||
        'detail' in exception ||
        'constraint' in exception ||
        'table' in exception)
    );
  }
}
