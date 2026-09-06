import { ApiError } from "./api-error";
import { API_ROUTES } from "./api-routes";
import { trimLeadingSlash, trimTrailingSlash } from "../utils";

const JSON_CONTENT_TYPE = "application/json";

let refreshPromise: Promise<void> | null = null;

interface ApiRequestOptions extends RequestInit {
  skipAuthRefresh?: boolean;
}

export async function apiRequest<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const response = await fetchApi(path, options);

  if (
    response.status === 401 &&
    !options.skipAuthRefresh &&
    path !== API_ROUTES.AUTH.REFRESH
  ) {
    await refreshAuthSession();

    return parseApiResponse<TResponse>(await fetchApi(path, options));
  }

  return parseApiResponse<TResponse>(response);
}

export async function apiJsonRequest<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  options: Omit<ApiRequestOptions, "body"> = {},
): Promise<TResponse> {
  return apiRequest<TResponse>(path, {
    ...options,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": JSON_CONTENT_TYPE,
      ...options.headers,
    },
  });
}

export function createApiUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const normalizedPath = trimLeadingSlash(path);

  if (!baseUrl) {
    return `/${normalizedPath}`;
  }

  return `${trimTrailingSlash(baseUrl)}/${normalizedPath}`;
}

async function fetchApi(
  path: string,
  { skipAuthRefresh, ...options }: ApiRequestOptions,
): Promise<Response> {
  void skipAuthRefresh;

  try {
    return await fetch(createApiUrl(path), {
      ...options,
      credentials: "include",
      headers: {
        Accept: JSON_CONTENT_TYPE,
        ...options.headers,
      },
    });
  } catch (error) {
    throw createNetworkApiError(error);
  }
}

async function refreshAuthSession(): Promise<void> {
  refreshPromise ??= fetchApi(API_ROUTES.AUTH.REFRESH, {
    method: "POST",
    skipAuthRefresh: true,
  })
    .then(async (response) => {
      if (!response.ok) {
        throw await createApiError(response);
      }
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

async function parseApiResponse<TResponse>(
  response: Response,
): Promise<TResponse> {
  if (!response.ok) {
    throw await createApiError(response);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes(JSON_CONTENT_TYPE)) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}

async function createApiError(response: Response): Promise<ApiError> {
  const payload = await readErrorPayload(response);
  const message =
    typeof payload === "object" &&
    payload !== null &&
    "message" in payload &&
    typeof payload.message === "string"
      ? payload.message
      : response.statusText || "Request failed.";

  return new ApiError(message, response.status, payload);
}

function createNetworkApiError(error: unknown): ApiError {
  return new ApiError("Network request failed.", 0, error);
}

async function readErrorPayload(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes(JSON_CONTENT_TYPE)) {
    return response.json();
  }

  return response.text();
}
