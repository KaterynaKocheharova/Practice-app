import type { HttpMethod } from "../common.enums";

/**
 * A failed backend call: `status` is `null` when no response arrived.
 * Only the stable `errorCode` crosses to the client, never backend text.
 */
export interface ServerApiFailure {
  errorCode: string | null;
  ok: false;
  status: number | null;
}

export type ServerApiResponse<TResponse> =
  { data: TResponse; ok: true } | ServerApiFailure;

export interface ServerApiRequestOptions {
  body?: unknown;
  /** Copy the backend's `Set-Cookie` onto this app's domain (server functions and route handlers only). */
  forwardSetCookies?: boolean;
  method?: HttpMethod;
}

/** A cookie the backend set, re-issued under this app's domain. */
export interface ForwardedCookie {
  expires?: Date;
  maxAge?: number;
  name: string;
  value: string;
}
