import { SetMetadata } from '@nestjs/common';
import type { UserRole } from 'src/modules/users/enums';
import { AUTH_METADATA } from '../constants/auth-metadata.constant';

export const Roles = (...roles: UserRole[]) =>
  SetMetadata(AUTH_METADATA.ROLES, roles);
