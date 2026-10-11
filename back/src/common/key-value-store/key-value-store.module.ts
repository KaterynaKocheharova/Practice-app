import { Module } from '@nestjs/common';
import { RedisModule } from 'src/common/redis';
import { KEY_VALUE_STORE } from './constants';
import { RedisKeyValueStoreService } from './services';

@Module({
  imports: [RedisModule],
  providers: [
    {
      provide: KEY_VALUE_STORE,
      useClass: RedisKeyValueStoreService,
    },
  ],
  exports: [KEY_VALUE_STORE],
})
export class KeyValueStoreModule {}
