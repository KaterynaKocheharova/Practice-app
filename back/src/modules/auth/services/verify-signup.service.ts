import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AUTH_RESPONSE } from 'src/common/constants/messages/responses/auth.response';
import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { UserStatus } from 'src/modules/users/enums/user-status.enum';
import { UsersService } from 'src/modules/users/services/users.service';
import type { VerifySignupDto } from '../dto/verify-signup.dto';
import { SignupVerificationTokenPurpose } from '../enums/signup-verification-token-purpose.enum';
import type { VerifySignupResult } from '../types/auth-token.type';
import { AuthTokenService } from './auth-token.service';
import { AuthVerificationService } from './helpers/auth-verification.service';

@Injectable()
export class VerifySignupService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authVerificationService: AuthVerificationService,
    private readonly authTokenService: AuthTokenService,
  ) {}

  async verifySignup(
    verifySignupDto: VerifySignupDto,
  ): Promise<VerifySignupResult> {
    const payload = await this.verifyToken(verifySignupDto.token);

    if (payload.purpose !== SignupVerificationTokenPurpose.VerifySignUp) {
      throw this.createInvalidTokenException();
    }

    const user = await this.usersService.getUserById(payload.sub);

    if (!user || user.email !== payload.email) {
      throw this.createInvalidTokenException();
    }

    if (user.status === UserStatus.Invited) {
      throw new BadRequestException({
        errorCode: ERROR_CODE.SIGNUP_VERIFICATION_NOT_ALLOWED,
      });
    }

    const activeUser =
      user.status === UserStatus.Active
        ? user
        : await this.usersService.updateUserById(user.id, {
            status: UserStatus.Active,
          });
    const tokens = await this.authTokenService.createSessionTokens(activeUser);

    return {
      response: {
        message: AUTH_RESPONSE.SIGN_UP_VERIFIED_MESSAGE,
      },
      tokens,
    };
  }

  private async verifyToken(token: string) {
    try {
      return await this.authVerificationService.verifySignupVerificationToken(
        token,
      );
    } catch {
      throw this.createInvalidTokenException();
    }
  }

  private createInvalidTokenException(): UnauthorizedException {
    return new UnauthorizedException({
      errorCode: ERROR_CODE.INVALID_SIGNUP_VERIFICATION_TOKEN,
    });
  }
}
