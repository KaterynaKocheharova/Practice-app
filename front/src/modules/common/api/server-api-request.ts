import "server-only";

import { cookies } from "next/headers";
import { HttpMethod } from "../common.enums";
import {
  parseSetCookieHeaders,
  toForwardedCookieOptions,
} from "./forwarded-cookies";
import { createServerApiUrl } from "./server-api-url";
import type {
  ServerApiFailure,
  ServerApiRequestOptions,
  ServerApiResponse,
} from "./types";

const JSON_CONTENT_TYPE = "application/json";
const NO_CONTENT_STATUS = 204;

/**
 * Every backend call goes through here: it forwards the browser's cookies,
 * never throws, and keeps backend error text on the server. Token refresh is
 * the proxy's job (see `src/proxy.ts`), so a 401 is just returned.
 */
export const serverApiRequest = async <TResponse>(
  path: string,
  {
    body,
    forwardSetCookies = false,
    method = HttpMethod.Get,
  }: ServerApiRequestOptions = {},
): Promise<ServerApiResponse<TResponse>> => {
  const url = createServerApiUrl(path);

  if (!url) {
    return createFailure(null);
  }

  try {
    const requestCookies = await cookies();
    const response = await fetch(url, {
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      headers: {
        Accept: JSON_CONTENT_TYPE,
        Cookie: requestCookies.toString(),
        ...(body === undefined ? {} : { "Content-Type": JSON_CONTENT_TYPE }),
      },
      method,
    });

    if (forwardSetCookies) {
      for (const cookie of parseSetCookieHeaders(response.headers)) {
        requestCookies.set(
          cookie.name,
          cookie.value,
          toForwardedCookieOptions(cookie),
        );
      }
    }

    if (!response.ok) {
      return createFailure(response.status, await readErrorCode(response));
    }

    return { data: await readData<TResponse>(response), ok: true };
  } catch {
    return createFailure(null);
  }
};

const createFailure = (
  status: number | null,
  errorCode: string | null = null,
): ServerApiFailure => ({ errorCode, ok: false, status });

const readData = async <TResponse>(response: Response): Promise<TResponse> => {
  const isJson = response.headers
    .get("content-type")
    ?.includes(JSON_CONTENT_TYPE);

  if (response.status === NO_CONTENT_STATUS || !isJson) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
};

const readErrorCode = async (response: Response): Promise<string | null> => {
  try {
    const payload: unknown = await response.json();

    return typeof payload === "object" &&
      payload !== null &&
      "errorCode" in payload &&
      typeof payload.errorCode === "string"
      ? payload.errorCode
      : null;
  } catch {
    return null;
  }
};
