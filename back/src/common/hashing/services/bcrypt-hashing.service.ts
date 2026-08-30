import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { IHashingService } from '../types';

@Injectable()
export class BcryptHashingService implements IHashingService {
  private readonly saltRounds = 12;

  hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.saltRounds);
  }
}
