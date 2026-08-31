import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { VERIFY_SIGNIN_SWAGGER } from 'src/constant/swagger/auth/verify-signin.swagger';

export class VerifySigninDto {
  @ApiProperty({
    example: VERIFY_SIGNIN_SWAGGER.BODY.TOKEN.EXAMPLE,
    description: VERIFY_SIGNIN_SWAGGER.BODY.TOKEN.DESCRIPTION,
    minLength: VERIFY_SIGNIN_SWAGGER.BODY.TOKEN.MIN_LENGTH,
  })
  @IsString()
  @MinLength(32)
  declare token: string;
}
