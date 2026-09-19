export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly payload: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function getApiErrorCode(error: unknown): string | undefined {
  if (!isApiError(error)) {
    return undefined;
  }

  const { payload } = error;

  if (
    typeof payload === "object" &&
    payload !== null &&
    "errorCode" in payload &&
    typeof payload.errorCode === "string"
  ) {
    return payload.errorCode;
  }

  return undefined;
}
