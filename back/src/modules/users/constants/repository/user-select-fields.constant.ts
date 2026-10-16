import { users } from '../../schemas/schema';

export const currentUserSelectFields = {
  id: users.id,
  name: users.name,
  email: users.email,
  avatarUrl: users.avatarUrl,
  role: users.role,
  status: users.status,
};

export const userSessionStatusSelectFields = {
  id: users.id,
  email: users.email,
  status: users.status,
};

export const userGoogleLinkSelectFields = {
  id: users.id,
  googleId: users.googleId,
  status: users.status,
};

export const authSessionUserSelectFields = {
  id: users.id,
  email: users.email,
};

export const googleAuthUserUpdateSelectFields = {
  id: users.id,
  email: users.email,
  role: users.role,
};
