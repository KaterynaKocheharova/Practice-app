import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { users } from '../schemas/schema';

export type CreateUserData = typeof users.$inferInsert;
export type UserData = typeof users.$inferSelect;
export type WithEmail<T extends Pick<UserData, 'email'>> = T & {
  email: string;
};
export type CurrentUserData = Pick<
  UserData,
  'id' | 'name' | 'email' | 'avatarUrl' | 'role' | 'status'
>;
export type CurrentUserResponse = WithEmail<
  Pick<CurrentUserData, 'id' | 'name' | 'email' | 'avatarUrl' | 'role'>
>;
export type UserGoogleLinkData = Pick<UserData, 'id' | 'googleId' | 'status'>;
export type UserAuthSessionData = Pick<UserData, 'id' | 'email'>;
export type UserSessionStatusData = Pick<UserData, 'id' | 'email' | 'status'>;
export type UserRoleProfileData = Pick<UserData, 'id' | 'role'>;
export type DatabaseTransaction = Parameters<
  Parameters<NodePgDatabase['transaction']>[0]
>[0];
