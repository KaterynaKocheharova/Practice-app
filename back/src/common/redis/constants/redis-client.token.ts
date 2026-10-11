import type { InjectionToken } from '@nestjs/common';

export const REDIS_CLIENT: InjectionToken = Symbol('REDIS_CLIENT');
