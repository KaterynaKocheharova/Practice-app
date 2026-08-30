import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories';
import type { CreateUserData, SafeUserData } from '../types';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  createUser(user: CreateUserData): Promise<SafeUserData> {
    return this.usersRepository.createUser(user);
  }

  getUserById(id: string): Promise<SafeUserData | undefined> {
    return this.usersRepository.getUserById(id);
  }

  getUserByEmail(email: string): Promise<SafeUserData | undefined> {
    return this.usersRepository.getUserByEmail(email);
  }

  updateUserById(
    id: string,
    user: Partial<CreateUserData>,
  ): Promise<SafeUserData> {
    return this.usersRepository.updateUserById(id, user);
  }
}
