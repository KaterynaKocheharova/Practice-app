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
