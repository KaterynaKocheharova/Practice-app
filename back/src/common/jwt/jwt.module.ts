import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWT_TOKEN_SERVICE } from './constants';
import { JwtTokenService } from './services';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    {
      provide: JWT_TOKEN_SERVICE,
      useClass: JwtTokenService,
    },
  ],
  exports: [JWT_TOKEN_SERVICE],
})
export class JwtTokenModule {}
