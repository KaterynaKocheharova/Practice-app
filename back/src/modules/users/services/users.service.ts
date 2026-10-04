import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories';
import type {
  CreateUserData,
  CurrentUserData,
  SafeUserData,
  UserAuthSessionData,
  UserAuthVerificationData,
  UserGoogleLinkData,
} from '../types';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  createUser(user: CreateUserData): Promise<SafeUserData> {
    return this.usersRepository.createUser(user);
  }

  createGoogleAuthUser(user: CreateUserData): Promise<UserAuthSessionData> {
    return this.usersRepository.createGoogleAuthUser(user);
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

  getUserIdByEmail(email: string): Promise<string | undefined> {
    return this.usersRepository.getUserIdByEmail(email);
  }

  getGoogleLinkDataByEmail(
    email: string,
  ): Promise<UserGoogleLinkData | undefined> {
    return this.usersRepository.getGoogleLinkDataByEmail(email);
  }

  getUserIdByGoogleId(googleId: string): Promise<string | undefined> {
    return this.usersRepository.getUserIdByGoogleId(googleId);
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

  activateUserById(id: string): Promise<void> {
    return this.usersRepository.activateUserById(id);
  }

  updateGoogleAuthUserById(
    id: string,
    user: Partial<CreateUserData>,
  ): Promise<UserAuthSessionData> {
    return this.usersRepository.updateGoogleAuthUserById(id, user);
  }
}
