import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser, JwtAccessGuard } from 'src/common/auth';
import { API_ROUTES } from 'src/common/constants';
import { GET_USER_BY_ID_SWAGGER } from 'src/constant/swagger/users/get-user-by-id.swagger';
import { USER_ROUTE_PARAMS } from '../constants';
import type { SafeUserData } from '../types';
import { UsersService } from '../services/users.service';

@ApiTags(GET_USER_BY_ID_SWAGGER.TAG)
@Controller(API_ROUTES.USERS.ROOT)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(API_ROUTES.USERS.BY_ID)
  @UseGuards(JwtAccessGuard)
  @ApiOperation({
    summary: GET_USER_BY_ID_SWAGGER.SUMMARY,
    description: GET_USER_BY_ID_SWAGGER.DESCRIPTION,
  })
  @ApiCookieAuth(GET_USER_BY_ID_SWAGGER.COOKIE_AUTH_NAME)
  @ApiParam({
    name: GET_USER_BY_ID_SWAGGER.PARAMS.ID.NAME,
    description: GET_USER_BY_ID_SWAGGER.PARAMS.ID.DESCRIPTION,
    example: GET_USER_BY_ID_SWAGGER.PARAMS.ID.EXAMPLE,
  })
  @ApiOkResponse({
    description: GET_USER_BY_ID_SWAGGER.OK_RESPONSE_DESCRIPTION,
    schema: {
      example: GET_USER_BY_ID_SWAGGER.OK_RESPONSE_EXAMPLE,
    },
  })
  @ApiUnauthorizedResponse({
    description: GET_USER_BY_ID_SWAGGER.UNAUTHORIZED_RESPONSE_DESCRIPTION,
    schema: {
      example: GET_USER_BY_ID_SWAGGER.UNAUTHORIZED_RESPONSE_EXAMPLE,
    },
  })
  @ApiForbiddenResponse({
    description: GET_USER_BY_ID_SWAGGER.FORBIDDEN_RESPONSE_DESCRIPTION,
    schema: {
      example: GET_USER_BY_ID_SWAGGER.FORBIDDEN_RESPONSE_EXAMPLE,
    },
  })
  getUserById(
    @Param(USER_ROUTE_PARAMS.ID) id: string,
    @CurrentUser() user: SafeUserData,
  ): SafeUserData {
    this.usersService.validateOwnUserAccess(id, user.id);

    return user;
  }
}
