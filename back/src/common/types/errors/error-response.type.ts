import { ErrorCode } from '../../constants/errors/error-code.constant';

export interface ErrorResponse {
  success: false;
  statusCode: number;
  errorCode: ErrorCode;
  message: string;
  path: string;
  timestamp: string;
  details?: unknown;
}
