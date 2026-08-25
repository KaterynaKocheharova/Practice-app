import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

import { ENV_NAMES } from '../configs/env-names';
import { devErrorMapper } from '../constants/errors/dev-error.mapper';
import { ERROR_CODE, ErrorCode } from '../constants/errors/error-code.constant';
import { prodErrorMapper } from '../constants/errors/prod-error.mapper';
import { ErrorResponse } from '../types/errors/error-response.type';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const statusCode = this.getStatusCode(exception);
    const errorCode = this.getErrorCode(exception);
    const message = this.getErrorMessage(errorCode);
    const details = this.getErrorDetails(exception);
    const errorResponse: ErrorResponse = {
      success: false,
      statusCode,
      errorCode,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
      ...(details === undefined ? {} : { details }),
    };

    response.status(statusCode).json(errorResponse);
  }

  private getStatusCode(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getErrorCode(exception: unknown): ErrorCode {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      if (this.hasErrorCode(response)) {
        return response.errorCode;
      }
    }

    return ERROR_CODE.INTERNAL_SERVER_ERROR;
  }

  private getErrorMessage(errorCode: ErrorCode): string {
    if (this.isProduction()) {
      return prodErrorMapper[errorCode];
    }

    return devErrorMapper[errorCode];
  }

  private getErrorDetails(exception: unknown): unknown {
    if (this.isProduction()) {
      return undefined;
    }

    if (exception instanceof HttpException) {
      return exception.getResponse();
    }

    return undefined;
  }

  private isProduction(): boolean {
    return this.configService.get<string>(ENV_NAMES.NODE_ENV) === 'production';
  }

  private hasErrorCode(
    response: unknown,
  ): response is { errorCode: ErrorCode } {
    return (
      typeof response === 'object' &&
      response !== null &&
      'errorCode' in response &&
      typeof response.errorCode === 'string'
    );
  }
}
