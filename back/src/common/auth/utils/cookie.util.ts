import type { Request } from 'express';

export const getRequestCookie = (
  request: Request,
  name: string,
): string | undefined => {
  const cookieHeader = request.headers.cookie;

  if (!cookieHeader) {
    return undefined;
  }

  const cookies = cookieHeader.split(';');

  for (const cookie of cookies) {
    const [rawName, ...rawValueParts] = cookie.trim().split('=');

    if (rawName === name) {
      return decodeURIComponent(rawValueParts.join('='));
    }
  }

  return undefined;
};
