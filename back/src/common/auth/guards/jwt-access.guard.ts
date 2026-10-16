import { ForbiddenException, Injectable } from '@nestjs/common';
import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { UserStatus } from 'src/modules/users/enums';
import { JwtUserGuard } from './jwt-user.guard';

/** Default guard: only users that finished onboarding. */
@Injectable()
export class JwtAccessGuard extends JwtUserGuard {
  protected assertStatusAllowed(status: UserStatus): void {
    if (status === UserStatus.Onboarding) {
      throw new ForbiddenException({
        errorCode: ERROR_CODE.ONBOARDING_REQUIRED,
      });
    }

    if (status !== UserStatus.Active) {
      throw this.createInvalidAccessTokenException();
    }
  }
}
