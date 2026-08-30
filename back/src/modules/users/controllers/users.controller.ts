import { Controller } from '@nestjs/common';
import { API_ROUTES } from 'src/common/constants';

@Controller(API_ROUTES.USERS.ROOT)
export class UsersController {}
