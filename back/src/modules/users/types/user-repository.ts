import { users } from '../schemas/schema';

export type CreateUserData = typeof users.$inferInsert;
export type UserData = typeof users.$inferSelect;
export type SafeUserData = Omit<UserData, 'passwordHash'>;
