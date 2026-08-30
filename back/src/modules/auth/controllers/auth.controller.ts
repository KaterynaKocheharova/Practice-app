import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { API_ROUTES } from 'src/common/constants';
import { AUTH_SWAGGER } from 'src/constant/swagger';
import { SignUpDto } from '../dto';
import { AuthService } from '../services';
import type { SignUpResponse } from '../types';

@ApiTags(AUTH_SWAGGER.TAG)
@Controller(API_ROUTES.AUTH.ROOT)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(API_ROUTES.AUTH.SIGN_UP)
  @ApiOperation({
    summary: AUTH_SWAGGER.SIGN_UP.SUMMARY,
    description: AUTH_SWAGGER.SIGN_UP.DESCRIPTION,
  })
  @ApiBody({
    type: SignUpDto,
    description: AUTH_SWAGGER.SIGN_UP.REQUEST_BODY_DESCRIPTION,
  })
  @ApiCreatedResponse({
    description: AUTH_SWAGGER.SIGN_UP.CREATED_RESPONSE_DESCRIPTION,
    schema: {
      example: AUTH_SWAGGER.SIGN_UP.CREATED_RESPONSE_EXAMPLE,
    },
  })
  @ApiConflictResponse({
    description: AUTH_SWAGGER.SIGN_UP.CONFLICT_RESPONSE_DESCRIPTION,
    schema: {
      example: AUTH_SWAGGER.SIGN_UP.CONFLICT_RESPONSE_EXAMPLE,
    },
  })
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() signUpDto: SignUpDto): Promise<SignUpResponse> {
    return this.authService.signUp(signUpDto);
  }
}
