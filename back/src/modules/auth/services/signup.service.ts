import { ConflictException, Inject, Injectable } from '@nestjs/common';

import { AUTH_RESPONSE } from 'src/common/constants/messages/responses/auth.response';
import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { HASHING_SERVICE } from 'src/common/hashing/constants/hashing-service.token';
import type { IHashingService } from 'src/common/hashing/types/hashing-service.type';
import { UserAuthProvider } from 'src/modules/users/enums/user-auth-provider.enum';
import { UserStatus } from 'src/modules/users/enums/user-status.enum';
import { UsersService } from 'src/modules/users/services/users.service';
import type { SignUpDto } from '../dto/sign-up.dto';
import { SignupVerificationTokenPurpose } from '../enums/signup-verification-token-purpose.enum';
import type { SignUpResponse } from '../types/signup.type';
import { AuthEmailQueueService } from './helpers/auth-email-queue.service';
import { AuthVerificationService } from './helpers/auth-verification.service';

@Injectable()
export class SignupService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authEmailQueueService: AuthEmailQueueService,
    private readonly authVerificationService: AuthVerificationService,
    @Inject(HASHING_SERVICE)
    private readonly hashingService: IHashingService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<SignUpResponse> {
    const existingUser = await this.usersService.getUserByEmail(
      signUpDto.email,
    );

    if (existingUser?.status === UserStatus.Active) {
      throw new ConflictException({
        errorCode: ERROR_CODE.USER_WITH_EMAIL_ALREADY_EXISTS,
      });
    }

    const passwordHash = await this.hashingService.hash(signUpDto.password);
    const user =
      existingUser?.status === UserStatus.VerificationInProgress
        ? await this.usersService.updateUserById(existingUser.id, {
            name: signUpDto.name,
            role: signUpDto.role,
            passwordHash,
          })
        : await this.usersService.createUser({
            name: signUpDto.name,
            email: signUpDto.email,
            role: signUpDto.role,
            passwordHash,
            authProvider: UserAuthProvider.Local,
            status: UserStatus.VerificationInProgress,
          });

    const verificationLink =
      await this.authVerificationService.createVerificationLink(
        user.id,
        signUpDto.email,
        SignupVerificationTokenPurpose.VerifySignUp,
      );

    await this.authEmailQueueService.enqueueSignupVerificationEmail({
      email: signUpDto.email,
      name: user.name,
      verificationLink,
    });

    return {
      message: AUTH_RESPONSE.SIGN_UP_ACCEPTED_MESSAGE,
      email: signUpDto.email,
    };
  }
}
