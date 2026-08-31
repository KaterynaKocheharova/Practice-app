import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { SIGN_IN_SWAGGER } from 'src/constant/swagger/auth/sign-in.swagger';

export class SignInDto {
  @ApiProperty({
    example: SIGN_IN_SWAGGER.BODY.EMAIL.EXAMPLE,
    description: SIGN_IN_SWAGGER.BODY.EMAIL.DESCRIPTION,
    format: SIGN_IN_SWAGGER.BODY.EMAIL.FORMAT,
  })
  @IsEmail()
  declare email: string;

  @ApiProperty({
    example: SIGN_IN_SWAGGER.BODY.PASSWORD.EXAMPLE,
    description: SIGN_IN_SWAGGER.BODY.PASSWORD.DESCRIPTION,
    minLength: SIGN_IN_SWAGGER.BODY.PASSWORD.MIN_LENGTH,
    writeOnly: SIGN_IN_SWAGGER.BODY.PASSWORD.WRITE_ONLY,
  })
  @IsString()
  @MinLength(8)
  declare password: string;
}
