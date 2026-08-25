import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DatabaseConfig } from '../../database/config/config';
import { HandleDatabaseError } from '../../database/decorators';
import { teacherSelectFields } from '../constants/repository';
import { teachers } from '../schemas/schema';
import type { CreateTeacherData, TeacherData } from '../types';

@Injectable()
export class TeachersRepository {
  constructor(
    @Inject(DatabaseConfig.DATABASE_INJECTION_TOKEN)
    private readonly database: NodePgDatabase,
  ) {}

  @HandleDatabaseError()
  async createTeacher(teacher: CreateTeacherData): Promise<TeacherData> {
    const [createdTeacher] = await this.database
      .insert(teachers)
      .values(teacher)
      .returning(teacherSelectFields);

    return createdTeacher;
  }

  @HandleDatabaseError()
  async getTeacherByUserId(userId: string): Promise<TeacherData> {
    const [teacher] = await this.database
      .select(teacherSelectFields)
      .from(teachers)
      .where(eq(teachers.userId, userId))
      .limit(1);

    return teacher;
  }
}
