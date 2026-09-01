import { users } from '../schemas/schema';

export type CreateUserData = typeof users.$inferInsert;
export type UserData = typeof users.$inferSelect;
export type SafeUserData = Omit<UserData, 'passwordHash'>;
export type CurrentUserData = Pick<
  UserData,
  'name' | 'email' | 'role' | 'status'
>;
export type CurrentUserResponse = Pick<
  CurrentUserData,
  'name' | 'email' | 'role'
>;
export type UserAuthVerificationData = Pick<
  UserData,
  'id' | 'name' | 'email' | 'passwordHash' | 'authProvider' | 'status'
>;
