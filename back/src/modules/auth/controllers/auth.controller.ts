import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { API_ROUTES } from 'src/common/constants';
import { SignUpDto } from '../dto';
import { AuthService } from '../services';
import type { SignUpResponse } from '../types';

@Controller(API_ROUTES.AUTH.ROOT)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(API_ROUTES.AUTH.SIGN_UP)
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() signUpDto: SignUpDto): Promise<SignUpResponse> {
    return this.authService.signUp(signUpDto);
  }
}
