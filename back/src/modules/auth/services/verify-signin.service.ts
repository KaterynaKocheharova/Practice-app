import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { AUTH_RESPONSE } from 'src/common/constants/messages/responses/auth.response';
import { UserStatus } from 'src/modules/users/enums/user-status.enum';
import { hasEmail } from 'src/modules/users/helpers';
import { UsersService } from 'src/modules/users/services/users.service';
import type { VerifySigninDto } from '../dto/verify-signin.dto';
import { SignupVerificationTokenPurpose } from '../enums/signup-verification-token-purpose.enum';
import type { VerifySigninResult } from '../types/auth-token.type';
import { AuthSessionService } from './auth-session.service';
import { AuthVerificationService } from './helpers/auth-verification.service';

@Injectable()
export class VerifySigninService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authVerificationService: AuthVerificationService,
    private readonly authSessionService: AuthSessionService,
  ) {}

  async verifySignin(
    verifySigninDto: VerifySigninDto,
  ): Promise<VerifySigninResult> {
    const payload = await this.verifyToken(verifySigninDto.token);

    if (payload.purpose !== SignupVerificationTokenPurpose.VerifySignIn) {
      throw this.createInvalidTokenException();
    }

    const user = await this.usersService.getUserById(payload.sub);

    if (!user || !hasEmail(user) || user.email !== payload.email) {
      throw this.createInvalidTokenException();
    }

    if (user.status !== UserStatus.Active) {
      throw new BadRequestException({
        errorCode: ERROR_CODE.SIGNIN_VERIFICATION_NOT_ALLOWED,
      });
    }

    if (
      !(await this.authVerificationService.consumeVerificationLink(
        verifySigninDto.token,
        payload,
        SignupVerificationTokenPurpose.VerifySignIn,
      ))
    ) {
      throw this.createInvalidTokenException();
    }

    const { tokens } = await this.authSessionService.createSessionTokens(user);

    return {
      response: {
        message: AUTH_RESPONSE.SIGN_IN_VERIFIED_MESSAGE,
      },
      tokens,
    };
  }

  private async verifyToken(token: string) {
    try {
      return await this.authVerificationService.verifySigninVerificationToken(
        token,
      );
    } catch {
      throw this.createInvalidTokenException();
    }
  }

  private createInvalidTokenException(): UnauthorizedException {
    return new UnauthorizedException({
      errorCode: ERROR_CODE.INVALID_SIGNIN_VERIFICATION_TOKEN,
    });
  }
}
