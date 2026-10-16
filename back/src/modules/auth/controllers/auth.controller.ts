import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiConflictResponse,
  ApiFoundResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import type { CookieOptions, Request, Response } from 'express';
import { getRequestCookie } from 'src/common/auth/utils/cookie.util';
import { isProductionEnv } from 'src/common/configs/env-config';
import { API_ROUTES } from 'src/common/constants';
import { GOOGLE_OAUTH_SWAGGER } from 'src/constant/swagger/auth/google-oauth.swagger';
import { LOGOUT_SWAGGER } from 'src/constant/swagger/auth/logout.swagger';
import { REFRESH_SWAGGER } from 'src/constant/swagger/auth/refresh.swagger';
import { authConfig } from '../config';
import { CurrentRefreshToken } from '../decorators';
import {
  GoogleOAuthCallbackQueryDto,
  GoogleOAuthExchangeDto,
} from '../dto/google-oauth.dto';
import { JwtRefreshGuard } from '../guards';
import { AuthService } from '../services/auth.service';
import type { AuthTokens } from '../types/auth-token.type';

@ApiTags(GOOGLE_OAUTH_SWAGGER.TAG)
@Controller(API_ROUTES.AUTH.ROOT)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get(API_ROUTES.AUTH.GOOGLE)
  @ApiOperation({
    summary: GOOGLE_OAUTH_SWAGGER.START.SUMMARY,
    description: GOOGLE_OAUTH_SWAGGER.START.DESCRIPTION,
  })
  @ApiFoundResponse({
    description: GOOGLE_OAUTH_SWAGGER.START.FOUND_RESPONSE_DESCRIPTION,
  })
  startGoogleOAuth(@Res() response: Response): void {
    const result = this.authService.createGoogleAuthorizationUrl();

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

      response.redirect(result.redirectUrl);
    } finally {
      response.clearCookie(
        authConfig.COOKIES.GOOGLE_OAUTH_STATE,
        this.createClearCookieOptions(),
      );
    }
  }

  /** Called server-to-server by the frontend with the callback's one-time code. */
  @Post(API_ROUTES.AUTH.GOOGLE_EXCHANGE)
  @Throttle({
    default: {
      limit: authConfig.RATE_LIMIT.SENSITIVE.LIMIT,
      ttl: authConfig.RATE_LIMIT.SENSITIVE.TTL_MS,
    },
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async exchangeGoogleOAuthCode(
    @Body() exchangeDto: GoogleOAuthExchangeDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const tokens = await this.authService.exchangeGoogleOAuthCode(
      exchangeDto.code,
    );

    this.setAuthCookies(response, tokens);
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
    @Headers(authConfig.HEADERS.USER_AGENT) userAgent: string | undefined,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const tokens = await this.authService.refresh(refreshToken, userAgent);

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
}
