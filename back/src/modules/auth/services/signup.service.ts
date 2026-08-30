import { ConflictException, Inject, Injectable } from '@nestjs/common';

import { AUTH_RESPONSE } from 'src/common/constants';
import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { HASHING_SERVICE } from 'src/common/hashing';
import type { IHashingService } from 'src/common/hashing';
import { UserStatus } from 'src/modules/users/enums';
import { UsersService } from 'src/modules/users/services/users.service';
import type { SignUpDto } from '../dto';
import type { SignUpResponse } from '../types';
import { AuthEmailQueueService, AuthVerificationService } from './helpers';

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
            authProvider: 'local',
            status: UserStatus.VerificationInProgress,
          });

    const verificationLink =
      await this.authVerificationService.createVerificationLink(
        user.id,
        user.email,
      );

    await this.authEmailQueueService.enqueueSignupVerificationEmail({
      email: user.email,
      name: user.name,
      verificationLink,
    });

    return {
      message: AUTH_RESPONSE.SIGN_UP_ACCEPTED_MESSAGE,
      email: user.email,
    };
  }
}
