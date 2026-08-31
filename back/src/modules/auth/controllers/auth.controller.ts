import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import type { CookieOptions, Response } from 'express';
import { isProductionEnv } from 'src/common/configs/env-config';
import { API_ROUTES } from 'src/common/constants/api-routes.constant';
import { AUTH_SWAGGER } from 'src/constant/swagger/auth/sign-up.swagger';
import { AUTH_COOKIE_NAMES } from '../constants/auth-cookie-names.constant';
import { SignUpDto } from '../dto/sign-up.dto';
import { VerifySignupDto } from '../dto/verify-signup.dto';
import { AuthService } from '../services/auth.service';
import type {
  AuthTokens,
  VerifySignupResponse,
} from '../types/auth-token.type';
import type { SignUpResponse } from '../types/signup.type';

@ApiTags(AUTH_SWAGGER.TAG)
@Controller(API_ROUTES.AUTH.ROOT)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

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

  @Post(API_ROUTES.AUTH.VERIFY_SIGNUP)
  @HttpCode(HttpStatus.OK)
  async verifySignup(
    @Body() verifySignupDto: VerifySignupDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<VerifySignupResponse> {
    const result = await this.authService.verifySignup(verifySignupDto);

    this.setAuthCookies(response, result.tokens);

    return result.response;
  }

  private setAuthCookies(response: Response, tokens: AuthTokens): void {
    response.cookie(
      AUTH_COOKIE_NAMES.ACCESS_TOKEN,
      tokens.accessToken,
      this.createCookieOptions(tokens.accessTokenExpiresAt),
    );
    response.cookie(
      AUTH_COOKIE_NAMES.REFRESH_TOKEN,
      tokens.refreshToken,
      this.createCookieOptions(tokens.refreshTokenExpiresAt),
    );
  }

  private createCookieOptions(expires: Date): CookieOptions {
    return {
      httpOnly: true,
      secure: isProductionEnv(this.configService),
      sameSite: 'lax',
      expires,
    };
  }
}
