import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { AUTH_RESPONSE } from 'src/common/constants/messages/responses/auth.response';
import { HASHING_SERVICE } from 'src/common/hashing/constants/hashing-service.token';
import type { IHashingService } from 'src/common/hashing/types/hashing-service.type';
import { UserAuthProvider } from 'src/modules/users/enums/user-auth-provider.enum';
import { UserStatus } from 'src/modules/users/enums/user-status.enum';
import { UsersService } from 'src/modules/users/services/users.service';
import type { UserAuthVerificationData } from 'src/modules/users/types';
import type { SignInDto } from '../dto/sign-in.dto';
import { SignupVerificationTokenPurpose } from '../enums/signup-verification-token-purpose.enum';
import type { SignInResponse } from '../types';
import { AuthEmailQueueService } from './helpers/auth-email-queue.service';
import { AuthVerificationService } from './helpers/auth-verification.service';

@Injectable()
export class SigninService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authEmailQueueService: AuthEmailQueueService,
    private readonly authVerificationService: AuthVerificationService,
    @Inject(HASHING_SERVICE)
    private readonly hashingService: IHashingService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<SignInResponse> {
    const user = await this.usersService.getUserAuthVerificationDataByEmail(
      signInDto.email,
    );

    if (
      !user ||
      !this.isAuthProviderValid(user) ||
      !this.isStatusValid(user) ||
      !(await this.isPasswordValid(user, signInDto.password))
    ) {
      throw this.createInvalidCredentialsException();
    }

    const verificationLink =
      await this.authVerificationService.createVerificationLink(
        user.id,
        user.email,
        SignupVerificationTokenPurpose.VerifySignIn,
      );

    await this.authEmailQueueService.enqueueSigninVerificationEmail({
      email: user.email,
      name: user.name,
      verificationLink,
    });

    return {
      message: AUTH_RESPONSE.SIGN_IN_ACCEPTED_MESSAGE,
      email: user.email,
    };
  }

  private isAuthProviderValid(user: UserAuthVerificationData): boolean {
    return user.authProvider === UserAuthProvider.Local;
  }

  private isStatusValid(user: UserAuthVerificationData): boolean {
    return user.status === UserStatus.Active;
  }

  private async isPasswordValid(
    user: UserAuthVerificationData,
    password: string,
  ): Promise<boolean> {
    return (
      !!user.passwordHash &&
      (await this.hashingService.compare(password, user.passwordHash))
    );
  }

  private createInvalidCredentialsException(): UnauthorizedException {
    return new UnauthorizedException({
      errorCode: ERROR_CODE.INVALID_CREDENTIALS,
    });
  }
}
