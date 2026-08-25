import { UserRole } from '../enums';

export interface CreateUserData {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type SafeUserData = Omit<UserData, 'passwordHash'>;
