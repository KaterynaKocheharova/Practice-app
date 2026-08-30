import { Injectable } from '@nestjs/common';
import type { SignUpDto } from '../dto';
import type { SignUpResponse } from '../types';
import { SignupService } from './signup.service';

@Injectable()
export class AuthService {
  constructor(private readonly signupService: SignupService) {}

  async signUp(signUpDto: SignUpDto): Promise<SignUpResponse> {
    return this.signupService.signUp(signUpDto);
  }
}
