import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DatabaseConfig } from '../../database/config/config';
import { HandleDatabaseError } from '../../database/decorators';
import { studentSelectFields } from '../constants/repository';
import { students } from '../schemas/schema';
import type { CreateStudentData, StudentData } from '../types';

@Injectable()
export class StudentsRepository {
  constructor(
    @Inject(DatabaseConfig.DATABASE_INJECTION_TOKEN)
    private readonly database: NodePgDatabase,
  ) {}

  @HandleDatabaseError()
  async createStudent(student: CreateStudentData): Promise<StudentData> {
    const [createdStudent] = await this.database
      .insert(students)
      .values(student)
      .returning(studentSelectFields);

    return createdStudent;
  }
}
