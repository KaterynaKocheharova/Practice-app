import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser, JwtAccessGuard } from 'src/common/auth';
import { API_ROUTES } from 'src/common/constants';
import { GET_ME_SWAGGER } from 'src/constant/swagger/users/get-me.swagger';
import type { SafeUserData } from '../types';

@ApiTags(GET_ME_SWAGGER.TAG)
@Controller(API_ROUTES.USERS.ROOT)
export class UsersController {
  @Get(API_ROUTES.USERS.ME)
  @UseGuards(JwtAccessGuard)
  @ApiOperation({
    summary: GET_ME_SWAGGER.SUMMARY,
    description: GET_ME_SWAGGER.DESCRIPTION,
  })
  @ApiCookieAuth(GET_ME_SWAGGER.COOKIE_AUTH_NAME)
  @ApiOkResponse({
    description: GET_ME_SWAGGER.OK_RESPONSE_DESCRIPTION,
    schema: {
      example: GET_ME_SWAGGER.OK_RESPONSE_EXAMPLE,
    },
  })
  @ApiUnauthorizedResponse({
    description: GET_ME_SWAGGER.UNAUTHORIZED_RESPONSE_DESCRIPTION,
    schema: {
      example: GET_ME_SWAGGER.UNAUTHORIZED_RESPONSE_EXAMPLE,
    },
  })
  getMe(@CurrentUser() user: SafeUserData): SafeUserData {
    return user;
  }
}
