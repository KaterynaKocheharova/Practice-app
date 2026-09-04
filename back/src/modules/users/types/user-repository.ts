import { users } from '../schemas/schema';

export type CreateUserData = typeof users.$inferInsert;
export type UserData = typeof users.$inferSelect;
export type SafeUserData = Omit<UserData, 'passwordHash'>;
export type CurrentUserData = Pick<
  UserData,
  'name' | 'email' | 'avatarUrl' | 'role' | 'status'
>;
export type CurrentUserResponse = Pick<
  CurrentUserData,
  'name' | 'email' | 'avatarUrl' | 'role'
>;
export type UserAuthVerificationData = Pick<
  UserData,
  'id' | 'name' | 'email' | 'passwordHash' | 'authProvider' | 'status'
>;
export type UserGoogleLinkData = Pick<UserData, 'id' | 'googleId'>;
export type UserAuthSessionData = Pick<UserData, 'id' | 'email' | 'role'>;
