import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories';
import type {
  CreateUserData,
  CurrentUserData,
  UserAuthSessionData,
  UserGoogleLinkData,
  UserSessionStatusData,
} from '../types';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  createGoogleAuthUser(user: CreateUserData): Promise<UserAuthSessionData> {
    return this.usersRepository.createGoogleAuthUser(user);
  }

  getUserSessionStatusById(
    id: string,
  ): Promise<UserSessionStatusData | undefined> {
    return this.usersRepository.getUserSessionStatusById(id);
  }

  getCurrentUserDataById(id: string): Promise<CurrentUserData | undefined> {
    return this.usersRepository.getCurrentUserDataById(id);
  }

  getGoogleLinkDataByEmail(
    email: string,
  ): Promise<UserGoogleLinkData | undefined> {
    return this.usersRepository.getGoogleLinkDataByEmail(email);
  }

  getUserIdByGoogleId(googleId: string): Promise<string | undefined> {
    return this.usersRepository.getUserIdByGoogleId(googleId);
  }

  updateGoogleAuthUserById(
    id: string,
    user: Partial<CreateUserData>,
  ): Promise<UserAuthSessionData> {
    return this.usersRepository.updateGoogleAuthUserById(id, user);
  }
}
