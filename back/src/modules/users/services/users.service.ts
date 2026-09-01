import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories';
import type {
  CreateUserData,
  CurrentUserData,
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

  getCurrentUserDataById(id: string): Promise<CurrentUserData | undefined> {
    return this.usersRepository.getCurrentUserDataById(id);
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
