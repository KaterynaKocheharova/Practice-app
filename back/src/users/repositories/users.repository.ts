import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DatabaseConfig } from '../../database/config/config';
import { userSelectFields } from '../constants/repository';
import { users } from '../schemas/schema';
import { CreateUserData, SafeUserData } from '../types';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(DatabaseConfig.DATABASE_INJECTION_TOKEN)
    private readonly database: NodePgDatabase,
  ) {}

  async createUser(user: CreateUserData): Promise<SafeUserData> {
    const [createdUser] = await this.database
      .insert(users)
      .values(user)
      .returning(userSelectFields);

    return createdUser;
  }

  async getUserById(id: string): Promise<SafeUserData | undefined> {
    const [user] = await this.database
      .select(userSelectFields)
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user;
  }
}
