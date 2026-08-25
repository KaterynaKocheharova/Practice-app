import { Injectable } from '@nestjs/common';

import { TeachersRepository } from '../repositories';
import type { CreateTeacherData, TeacherData } from '../types';

@Injectable()
export class TeachersService {
  constructor(private readonly teachersRepository: TeachersRepository) {}

  createTeacher(teacher: CreateTeacherData): Promise<TeacherData> {
    return this.teachersRepository.createTeacher(teacher);
  }

  getTeacherByUserId(userId: string): Promise<TeacherData | undefined> {
    return this.teachersRepository.getTeacherByUserId(userId);
  }
}
