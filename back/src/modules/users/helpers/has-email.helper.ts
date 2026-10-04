import type { UserData, WithEmail } from '../types';

/**
 * Managed users may have no email; auth flows only accept users that do.
 */
export const hasEmail = <T extends Pick<UserData, 'email'>>(
  user: T,
): user is WithEmail<T> => user.email !== null;
