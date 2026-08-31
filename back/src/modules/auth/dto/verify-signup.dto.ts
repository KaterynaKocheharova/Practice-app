import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { VERIFY_SIGNUP_SWAGGER } from 'src/constant/swagger/auth/verify-signup.swagger';

export class VerifySignupDto {
  @ApiProperty({
    example: VERIFY_SIGNUP_SWAGGER.BODY.TOKEN.EXAMPLE,
    description: VERIFY_SIGNUP_SWAGGER.BODY.TOKEN.DESCRIPTION,
    minLength: VERIFY_SIGNUP_SWAGGER.BODY.TOKEN.MIN_LENGTH,
  })
  @IsString()
  @MinLength(32)
  declare token: string;
}