import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import type { CookieOptions, Request, Response } from 'express';
import { CurrentUser, JwtAccessGuard } from 'src/common/auth';
import { getRequestCookie } from 'src/common/auth/utils/cookie.util';
import { isProductionEnv } from 'src/common/configs/env-config';
import { API_ROUTES } from 'src/common/constants';
import { CHANGE_PASSWORD_SWAGGER } from 'src/constant/swagger/auth/change-password.swagger';
import { GOOGLE_OAUTH_SWAGGER } from 'src/constant/swagger/auth/google-oauth.swagger';
import { LOGOUT_SWAGGER } from 'src/constant/swagger/auth/logout.swagger';
import { REFRESH_SWAGGER } from 'src/constant/swagger/auth/refresh.swagger';
import { SIGN_IN_SWAGGER } from 'src/constant/swagger/auth/sign-in.swagger';
import { AUTH_SWAGGER } from 'src/constant/swagger/auth/sign-up.swagger';
import { VERIFY_SIGNIN_SWAGGER } from 'src/constant/swagger/auth/verify-signin.swagger';
import { VERIFY_SIGNUP_SWAGGER } from 'src/constant/swagger/auth/verify-signup.swagger';
import { authConfig } from '../config';
import { CurrentRefreshToken } from '../decorators';
import { ChangePasswordDto } from '../dto/change-password.dto';
import {
  GoogleOAuthCallbackQueryDto,
  GoogleSignUpOAuthQueryDto,
} from '../dto/google-oauth.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { SignUpDto } from '../dto/sign-up.dto';
import { VerifySigninDto } from '../dto/verify-signin.dto';
import { VerifySignupDto } from '../dto/verify-signup.dto';
import { JwtRefreshGuard } from '../guards';
import { AuthService } from '../services/auth.service';
import type {
  AuthTokens,
  VerifySigninResponse,
  VerifySignupResponse,
} from '../types/auth-token.type';
import type { GoogleOAuthStartResult } from '../types';
import type { CurrentUserResponse } from 'src/modules/users/types';
import type { SignInResponse } from '../types/signin.type';
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
  @Throttle({
    default: {
      limit: authConfig.RATE_LIMIT.SENSITIVE.LIMIT,
      ttl: authConfig.RATE_LIMIT.SENSITIVE.TTL_MS,
    },
  })
  @ApiOperation({
    summary: VERIFY_SIGNUP_SWAGGER.SUMMARY,
    description: VERIFY_SIGNUP_SWAGGER.DESCRIPTION,
  })
  @ApiBody({
    type: VerifySignupDto,
    description: VERIFY_SIGNUP_SWAGGER.REQUEST_BODY_DESCRIPTION,
  })
  @ApiOkResponse({
    description: VERIFY_SIGNUP_SWAGGER.OK_RESPONSE_DESCRIPTION,
    schema: {
      example: VERIFY_SIGNUP_SWAGGER.OK_RESPONSE_EXAMPLE,
    },
  })
  @ApiUnauthorizedResponse({
    description: VERIFY_SIGNUP_SWAGGER.UNAUTHORIZED_RESPONSE_DESCRIPTION,
    schema: {
      example: VERIFY_SIGNUP_SWAGGER.UNAUTHORIZED_RESPONSE_EXAMPLE,
    },
  })
  @ApiBadRequestResponse({
    description: VERIFY_SIGNUP_SWAGGER.BAD_REQUEST_RESPONSE_DESCRIPTION,
    schema: {
      example: VERIFY_SIGNUP_SWAGGER.BAD_REQUEST_RESPONSE_EXAMPLE,
    },
  })
  @HttpCode(HttpStatus.OK)
  async verifySignup(
    @Body() verifySignupDto: VerifySignupDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<VerifySignupResponse> {
    const result = await this.authService.verifySignup(verifySignupDto);

    this.setAuthCookies(response, result.tokens);

    return result.response;
  }

  @Post(API_ROUTES.AUTH.SIGN_IN)
  @Throttle({
    default: {
      limit: authConfig.RATE_LIMIT.SENSITIVE.LIMIT,
      ttl: authConfig.RATE_LIMIT.SENSITIVE.TTL_MS,
    },
  })
  @ApiOperation({
    summary: SIGN_IN_SWAGGER.SUMMARY,
    description: SIGN_IN_SWAGGER.DESCRIPTION,
  })
  @ApiBody({
    type: SignInDto,
    description: SIGN_IN_SWAGGER.REQUEST_BODY_DESCRIPTION,
  })
  @ApiAcceptedResponse({
    description: SIGN_IN_SWAGGER.ACCEPTED_RESPONSE_DESCRIPTION,
    schema: {
      example: SIGN_IN_SWAGGER.ACCEPTED_RESPONSE_EXAMPLE,
    },
  })
  @ApiUnauthorizedResponse({
    description: SIGN_IN_SWAGGER.UNAUTHORIZED_RESPONSE_DESCRIPTION,
    schema: {
      example: SIGN_IN_SWAGGER.UNAUTHORIZED_RESPONSE_EXAMPLE,
    },
  })
  @HttpCode(HttpStatus.ACCEPTED)
  signIn(@Body() signInDto: SignInDto): Promise<SignInResponse> {
    return this.authService.signIn(signInDto);
  }

  @Post(API_ROUTES.AUTH.VERIFY_SIGNIN)
  @Throttle({
    default: {
      limit: authConfig.RATE_LIMIT.SENSITIVE.LIMIT,
      ttl: authConfig.RATE_LIMIT.SENSITIVE.TTL_MS,
    },
  })
  @ApiOperation({
    summary: VERIFY_SIGNIN_SWAGGER.SUMMARY,
    description: VERIFY_SIGNIN_SWAGGER.DESCRIPTION,
  })
  @ApiBody({
    type: VerifySigninDto,
    description: VERIFY_SIGNIN_SWAGGER.REQUEST_BODY_DESCRIPTION,
  })
  @ApiOkResponse({
    description: VERIFY_SIGNIN_SWAGGER.OK_RESPONSE_DESCRIPTION,
    schema: {
      example: VERIFY_SIGNIN_SWAGGER.OK_RESPONSE_EXAMPLE,
    },
  })
  @ApiUnauthorizedResponse({
    description: VERIFY_SIGNIN_SWAGGER.UNAUTHORIZED_RESPONSE_DESCRIPTION,
    schema: {
      example: VERIFY_SIGNIN_SWAGGER.UNAUTHORIZED_RESPONSE_EXAMPLE,
    },
  })
  @ApiBadRequestResponse({
    description: VERIFY_SIGNIN_SWAGGER.BAD_REQUEST_RESPONSE_DESCRIPTION,
    schema: {
      example: VERIFY_SIGNIN_SWAGGER.BAD_REQUEST_RESPONSE_EXAMPLE,
    },
  })
  @HttpCode(HttpStatus.OK)
  async verifySignin(
    @Body() verifySigninDto: VerifySigninDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<VerifySigninResponse> {
    const result = await this.authService.verifySignin(verifySigninDto);

    this.setAuthCookies(response, result.tokens);

    return result.response;
  }

  @Post(API_ROUTES.AUTH.REFRESH)
  @UseGuards(JwtRefreshGuard)
  @Throttle({
    default: {
      limit: authConfig.RATE_LIMIT.SENSITIVE.LIMIT,
      ttl: authConfig.RATE_LIMIT.SENSITIVE.TTL_MS,
    },
  })
  @ApiOperation({
    summary: REFRESH_SWAGGER.SUMMARY,
    description: REFRESH_SWAGGER.DESCRIPTION,
  })
  @ApiCookieAuth(REFRESH_SWAGGER.COOKIE_AUTH_NAME)
  @ApiNoContentResponse({
    description: REFRESH_SWAGGER.NO_CONTENT_RESPONSE_DESCRIPTION,
  })
  @ApiUnauthorizedResponse({
    description: REFRESH_SWAGGER.UNAUTHORIZED_RESPONSE_DESCRIPTION,
    schema: {
      example: REFRESH_SWAGGER.UNAUTHORIZED_RESPONSE_EXAMPLE,
    },
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async refresh(
    @CurrentRefreshToken() refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const tokens = await this.authService.refresh(refreshToken);

    this.setAuthCookies(response, tokens);
  }

  @Post(API_ROUTES.AUTH.LOGOUT)
  @ApiOperation({
    summary: LOGOUT_SWAGGER.SUMMARY,
    description: LOGOUT_SWAGGER.DESCRIPTION,
  })
  @ApiNoContentResponse({
    description: LOGOUT_SWAGGER.NO_CONTENT_RESPONSE_DESCRIPTION,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    try {
      await this.authService.logout({
        accessToken: getRequestCookie(request, authConfig.COOKIES.ACCESS_TOKEN),
        refreshToken: getRequestCookie(
          request,
          authConfig.COOKIES.REFRESH_TOKEN,
        ),
      });
    } finally {
      this.clearAuthCookies(response);
    }
  }

  @Post(API_ROUTES.AUTH.CHANGE_PASSWORD)
  @UseGuards(JwtAccessGuard)
  @ApiOperation({
    summary: CHANGE_PASSWORD_SWAGGER.SUMMARY,
    description: CHANGE_PASSWORD_SWAGGER.DESCRIPTION,
  })
  @ApiCookieAuth(CHANGE_PASSWORD_SWAGGER.COOKIE_AUTH_NAME)
  @ApiBody({
    type: ChangePasswordDto,
    description: CHANGE_PASSWORD_SWAGGER.REQUEST_BODY_DESCRIPTION,
  })
  @ApiNoContentResponse({
    description: CHANGE_PASSWORD_SWAGGER.NO_CONTENT_RESPONSE_DESCRIPTION,
  })
  @ApiBadRequestResponse({
    description: CHANGE_PASSWORD_SWAGGER.BAD_REQUEST_RESPONSE_DESCRIPTION,
    schema: {
      example: CHANGE_PASSWORD_SWAGGER.BAD_REQUEST_RESPONSE_EXAMPLE,
    },
  })
  @ApiUnauthorizedResponse({
    description: CHANGE_PASSWORD_SWAGGER.UNAUTHORIZED_RESPONSE_DESCRIPTION,
    schema: {
      example: CHANGE_PASSWORD_SWAGGER.UNAUTHORIZED_RESPONSE_EXAMPLE,
    },
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(
    @CurrentUser() user: CurrentUserResponse,
    @Body() changePasswordDto: ChangePasswordDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.changePassword(user.email, changePasswordDto);
    this.clearAuthCookies(response);
  }

  private setAuthCookies(response: Response, tokens: AuthTokens): void {
    response.cookie(
      authConfig.COOKIES.ACCESS_TOKEN,
      tokens.accessToken,
      this.createCookieOptions(tokens.accessTokenExpiresAt),
    );
    response.cookie(
      authConfig.COOKIES.REFRESH_TOKEN,
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

  private clearAuthCookies(response: Response): void {
    const cookieOptions = this.createClearCookieOptions();

    response.clearCookie(authConfig.COOKIES.ACCESS_TOKEN, cookieOptions);
    response.clearCookie(authConfig.COOKIES.REFRESH_TOKEN, cookieOptions);
  }

  private createClearCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: isProductionEnv(this.configService),
      sameSite: 'lax',
    };
  }

  @Get(API_ROUTES.AUTH.GOOGLE_SIGN_IN)
  @ApiOperation({
    summary: GOOGLE_OAUTH_SWAGGER.SIGN_IN_START.SUMMARY,
    description: GOOGLE_OAUTH_SWAGGER.SIGN_IN_START.DESCRIPTION,
  })
  @ApiFoundResponse({
    description: GOOGLE_OAUTH_SWAGGER.SIGN_IN_START.FOUND_RESPONSE_DESCRIPTION,
  })
  startGoogleSignInOAuth(@Res() response: Response): void {
    const result = this.authService.createGoogleSignInAuthorizationUrl();

    this.redirectToGoogleOAuth(response, result);
  }

  @Get(API_ROUTES.AUTH.GOOGLE_SIGN_UP)
  @ApiOperation({
    summary: GOOGLE_OAUTH_SWAGGER.SIGN_UP_START.SUMMARY,
    description: GOOGLE_OAUTH_SWAGGER.SIGN_UP_START.DESCRIPTION,
  })
  @ApiFoundResponse({
    description: GOOGLE_OAUTH_SWAGGER.SIGN_UP_START.FOUND_RESPONSE_DESCRIPTION,
  })
  @ApiQuery({
    name: GOOGLE_OAUTH_SWAGGER.SIGN_UP_START.QUERY.ROLE.NAME,
    enum: GOOGLE_OAUTH_SWAGGER.SIGN_UP_START.QUERY.ROLE.ENUM,
    example: GOOGLE_OAUTH_SWAGGER.SIGN_UP_START.QUERY.ROLE.EXAMPLE,
    description: GOOGLE_OAUTH_SWAGGER.SIGN_UP_START.QUERY.ROLE.DESCRIPTION,
  })
  @ApiBadRequestResponse({
    description:
      GOOGLE_OAUTH_SWAGGER.SIGN_UP_START.BAD_REQUEST_RESPONSE_DESCRIPTION,
    schema: {
      example: GOOGLE_OAUTH_SWAGGER.SIGN_UP_START.BAD_REQUEST_RESPONSE_EXAMPLE,
    },
  })
  startGoogleSignUpOAuth(
    @Query() query: GoogleSignUpOAuthQueryDto,
    @Res() response: Response,
  ): void {
    const result = this.authService.createGoogleSignUpAuthorizationUrl(
      query.role,
    );

    this.redirectToGoogleOAuth(response, result);
  }

  private redirectToGoogleOAuth(
    response: Response,
    result: GoogleOAuthStartResult,
  ): void {
    response.cookie(
      authConfig.COOKIES.GOOGLE_OAUTH_STATE,
      result.stateNonce,
      this.createCookieOptions(result.stateExpiresAt),
    );
    response.redirect(result.authorizationUrl);
  }

  @Get(API_ROUTES.AUTH.GOOGLE_CALLBACK)
  @ApiOperation({
    summary: GOOGLE_OAUTH_SWAGGER.CALLBACK.SUMMARY,
    description: GOOGLE_OAUTH_SWAGGER.CALLBACK.DESCRIPTION,
  })
  @ApiFoundResponse({
    description: GOOGLE_OAUTH_SWAGGER.CALLBACK.FOUND_RESPONSE_DESCRIPTION,
  })
  @ApiQuery({
    name: GOOGLE_OAUTH_SWAGGER.CALLBACK.QUERY.CODE.NAME,
    required: false,
    example: GOOGLE_OAUTH_SWAGGER.CALLBACK.QUERY.CODE.EXAMPLE,
    description: GOOGLE_OAUTH_SWAGGER.CALLBACK.QUERY.CODE.DESCRIPTION,
  })
  @ApiQuery({
    name: GOOGLE_OAUTH_SWAGGER.CALLBACK.QUERY.STATE.NAME,
    required: false,
    example: GOOGLE_OAUTH_SWAGGER.CALLBACK.QUERY.STATE.EXAMPLE,
    description: GOOGLE_OAUTH_SWAGGER.CALLBACK.QUERY.STATE.DESCRIPTION,
  })
  @ApiQuery({
    name: GOOGLE_OAUTH_SWAGGER.CALLBACK.QUERY.ERROR.NAME,
    required: false,
    example: GOOGLE_OAUTH_SWAGGER.CALLBACK.QUERY.ERROR.EXAMPLE,
    description: GOOGLE_OAUTH_SWAGGER.CALLBACK.QUERY.ERROR.DESCRIPTION,
  })
  @ApiBadRequestResponse({
    description: GOOGLE_OAUTH_SWAGGER.CALLBACK.BAD_REQUEST_RESPONSE_DESCRIPTION,
    schema: {
      example: GOOGLE_OAUTH_SWAGGER.CALLBACK.BAD_REQUEST_RESPONSE_EXAMPLE,
    },
  })
  @ApiUnauthorizedResponse({
    description:
      GOOGLE_OAUTH_SWAGGER.CALLBACK.UNAUTHORIZED_RESPONSE_DESCRIPTION,
    schema: {
      example: GOOGLE_OAUTH_SWAGGER.CALLBACK.UNAUTHORIZED_RESPONSE_EXAMPLE,
    },
  })
  @ApiConflictResponse({
    description: GOOGLE_OAUTH_SWAGGER.CALLBACK.CONFLICT_RESPONSE_DESCRIPTION,
    schema: {
      example: GOOGLE_OAUTH_SWAGGER.CALLBACK.CONFLICT_RESPONSE_EXAMPLE,
    },
  })
  async handleGoogleOAuthCallback(
    @Query() query: GoogleOAuthCallbackQueryDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    try {
      const result = await this.authService.handleGoogleCallback({
        code: query.code,
        error: query.error,
        state: query.state,
        stateNonce: getRequestCookie(
          request,
          authConfig.COOKIES.GOOGLE_OAUTH_STATE,
        ),
      });

      this.setAuthCookies(response, result.tokens);
      response.redirect(result.redirectUrl);
    } finally {
      response.clearCookie(
        authConfig.COOKIES.GOOGLE_OAUTH_STATE,
        this.createClearCookieOptions(),
      );
    }
  }
}
