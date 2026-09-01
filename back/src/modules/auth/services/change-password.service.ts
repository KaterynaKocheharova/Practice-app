import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { HASHING_SERVICE } from 'src/common/hashing/constants/hashing-service.token';
import type { IHashingService } from 'src/common/hashing/types/hashing-service.type';
import { UserAuthProvider } from 'src/modules/users/enums/user-auth-provider.enum';
import { UserStatus } from 'src/modules/users/enums/user-status.enum';
import { UsersService } from 'src/modules/users/services/users.service';
import type { UserAuthVerificationData } from 'src/modules/users/types';
import type { ChangePasswordDto } from '../dto/change-password.dto';
import { AuthSessionService } from './auth-session.service';

@Injectable()
export class ChangePasswordService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authSessionService: AuthSessionService,
    @Inject(HASHING_SERVICE)
    private readonly hashingService: IHashingService,
  ) {}

  async changePassword(
    email: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    this.validateNewPassword(changePasswordDto);

    const user =
      await this.usersService.getUserAuthVerificationDataByEmail(email);

    if (
      !user ||
      !(await this.isUserValid(user, changePasswordDto.currentPassword))
    ) {
      throw this.createInvalidCredentialsException();
    }

    const passwordHash = await this.hashingService.hash(
      changePasswordDto.newPassword,
    );

    await this.usersService.updateUserById(user.id, { passwordHash });
    await this.authSessionService.revokeSessionsByUserId(user.id);
  }

  private validateNewPassword(changePasswordDto: ChangePasswordDto): void {
    if (changePasswordDto.currentPassword === changePasswordDto.newPassword) {
      throw new BadRequestException({
        errorCode: ERROR_CODE.PASSWORDS_MUST_BE_DIFFERENT,
      });
    }
  }

  private async isUserValid(
    user: UserAuthVerificationData,
    currentPassword: string,
  ): Promise<boolean> {
    return (
      this.isAuthProviderValid(user) &&
      this.isStatusValid(user) &&
      (await this.isCurrentPasswordValid(user, currentPassword))
    );
  }

  private isAuthProviderValid(user: UserAuthVerificationData): boolean {
    return user.authProvider === UserAuthProvider.Local;
  }

  private isStatusValid(user: UserAuthVerificationData): boolean {
    return user.status === UserStatus.Active;
  }

  private async isCurrentPasswordValid(
    user: UserAuthVerificationData,
    currentPassword: string,
  ): Promise<boolean> {
    return (
      !!user.passwordHash &&
      (await this.hashingService.compare(currentPassword, user.passwordHash))
    );
  }

  private createInvalidCredentialsException(): UnauthorizedException {
    return new UnauthorizedException({
      errorCode: ERROR_CODE.INVALID_CREDENTIALS,
    });
  }
}
