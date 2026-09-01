import { ForbiddenException, Injectable } from '@nestjs/common';
import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { UsersRepository } from '../repositories';
import type {
  CreateUserData,
  SafeUserData,
  UserAuthVerificationData,
} from '../types';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  createUser(user: CreateUserData): Promise<SafeUserData> {
    return this.usersRepository.createUser(user);
  }

  getUserById(id: string): Promise<SafeUserData | undefined> {
    return this.usersRepository.getUserById(id);
  }

  validateOwnUserAccess(id: string, authenticatedUserId: string): void {
    if (id !== authenticatedUserId) {
      throw new ForbiddenException({
        errorCode: ERROR_CODE.ACCESS_DENIED,
      });
    }
  }

  getUserByEmail(email: string): Promise<SafeUserData | undefined> {
    return this.usersRepository.getUserByEmail(email);
  }

  getUserAuthVerificationDataByEmail(
    email: string,
  ): Promise<UserAuthVerificationData | undefined> {
    return this.usersRepository.getUserAuthVerificationDataByEmail(email);
  }

  updateUserById(
    id: string,
    user: Partial<CreateUserData>,
  ): Promise<SafeUserData> {
    return this.usersRepository.updateUserById(id, user);
  }
}
