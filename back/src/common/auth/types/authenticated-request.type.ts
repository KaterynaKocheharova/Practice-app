import type { Request } from 'express';
import type { SafeUserData } from 'src/modules/users/types';

export interface AuthenticatedRequest extends Request {
  user: SafeUserData;
}
