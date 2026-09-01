import { users } from '../../schemas/schema';

export const userSelectFields = {
  id: users.id,
  name: users.name,
  email: users.email,
  authProvider: users.authProvider,
  googleId: users.googleId,
  role: users.role,
  status: users.status,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
};

export const currentUserSelectFields = {
  name: users.name,
  email: users.email,
  role: users.role,
  status: users.status,
};

export const userAuthVerificationSelectFields = {
  id: users.id,
  name: users.name,
  email: users.email,
  passwordHash: users.passwordHash,
  authProvider: users.authProvider,
  status: users.status,
};
