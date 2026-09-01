import type { Request } from 'express';
import type { CurrentUserResponse } from 'src/modules/users/types';

export interface AuthenticatedRequest extends Request {
  user: CurrentUserResponse;
}
