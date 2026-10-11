import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/common/redis';
import type { IKeyValueStore } from '../types';

@Injectable()
export class RedisKeyValueStoreService implements IKeyValueStore {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async set(key: string, value: string, ttlMs: number): Promise<void> {
    await this.redis.set(key, value, 'PX', ttlMs);
  }

  async get(key: string): Promise<string | undefined> {
    return (await this.redis.get(key)) ?? undefined;
  }

  async getDelete(key: string): Promise<string | undefined> {
    return (await this.redis.getdel(key)) ?? undefined;
  }
}
