import { Module } from '@nestjs/common';
import { HASHING_SERVICE } from './constants';
import { BcryptHashingService } from './services';

@Module({
  providers: [
    {
      provide: HASHING_SERVICE,
      useClass: BcryptHashingService,
    },
  ],
  exports: [HASHING_SERVICE],
})
export class HashingModule {}
