import { Injectable } from '@nestjs/common';
import type { UserStatus } from 'src/modules/users/enums';
import { isSessionAllowedStatus } from 'src/modules/users/helpers';
import { JwtUserGuard } from './jwt-user.guard';

@Injectable()
export class JwtOnboardingAccessGuard extends JwtUserGuard {
  protected assertStatusAllowed(status: UserStatus): void {
    if (!isSessionAllowedStatus(status)) {
      throw this.createInvalidAccessTokenException();
    }
  }
}
