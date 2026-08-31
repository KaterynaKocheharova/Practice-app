import { HttpException, Injectable } from '@nestjs/common';

import { databaseErrorMapper } from '../../common/constants/errors/database-error.mapper';
import { databaseHttpStatusMapper } from '../../common/constants/errors/database-http-status.mapper';
import { DATABASE_ERROR_CODE } from '../../common/constants/errors/error-code.constant';
import { PostgresError } from '../../common/types/errors/postgres-error.type';

@Injectable()
export class DatabaseErrorMapper {
  map(exception: unknown): HttpException | undefined {
    const postgresError = this.getPostgresError(exception);

    if (!postgresError) {
      return undefined;
    }

    const errorCode =
      databaseErrorMapper[postgresError.code] ??
      DATABASE_ERROR_CODE.DATABASE_ERROR;

    return new HttpException(
      {
        errorCode,
        databaseError: {
          code: postgresError.code,
          detail: postgresError.detail,
          constraint: postgresError.constraint,
          table: postgresError.table,
        },
      },
      databaseHttpStatusMapper[errorCode],
    );
  }

  private getPostgresError(exception: unknown): PostgresError | undefined {
    if (this.isPostgresError(exception)) {
      return exception;
    }

    if (
      typeof exception === 'object' &&
      exception !== null &&
      'cause' in exception &&
      this.isPostgresError(exception.cause)
    ) {
      return exception.cause;
    }

    return undefined;
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
