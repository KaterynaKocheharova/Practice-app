import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories';
import { CreateUserData, SafeUserData } from '../types';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  createUser(user: CreateUserData): Promise<SafeUserData> {
    return this.usersRepository.createUser(user);
  }

  getUserById(id: string): Promise<SafeUserData | undefined> {
    return this.usersRepository.getUserById(id);
  }
}
