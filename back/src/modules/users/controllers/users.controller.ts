import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CurrentUser, JwtAccessGuard } from 'src/common/auth';
import { API_ROUTES } from 'src/common/constants';
import { USER_ROUTE_PARAMS } from '../constants';
import type { SafeUserData } from '../types';
import { UsersService } from '../services/users.service';

@Controller(API_ROUTES.USERS.ROOT)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(API_ROUTES.USERS.BY_ID)
  @UseGuards(JwtAccessGuard)
  getUserById(
    @Param(USER_ROUTE_PARAMS.ID) id: string,
    @CurrentUser() user: SafeUserData,
  ): SafeUserData {
    this.usersService.validateOwnUserAccess(id, user.id);

    return user;
  }
}
