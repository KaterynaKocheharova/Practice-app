import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, Matches, MinLength } from 'class-validator';
import { AUTH_SWAGGER } from 'src/constant/swagger/auth/sign-up.swagger';
import { PASSWORD_COMPLEXITY } from 'src/common/constants/password-complexity.constant';
import { UserRole } from 'src/modules/users/enums';

export class SignUpDto {
  @ApiProperty({
    example: AUTH_SWAGGER.SIGN_UP.BODY.EMAIL.EXAMPLE,
    description: AUTH_SWAGGER.SIGN_UP.BODY.EMAIL.DESCRIPTION,
    format: AUTH_SWAGGER.SIGN_UP.BODY.EMAIL.FORMAT,
  })
  @IsEmail()
  declare email: string;

  @ApiProperty({
    example: AUTH_SWAGGER.SIGN_UP.BODY.PASSWORD.EXAMPLE,
    description: AUTH_SWAGGER.SIGN_UP.BODY.PASSWORD.DESCRIPTION,
    minLength: AUTH_SWAGGER.SIGN_UP.BODY.PASSWORD.MIN_LENGTH,
    writeOnly: AUTH_SWAGGER.SIGN_UP.BODY.PASSWORD.WRITE_ONLY,
  })
  @IsString()
  @MinLength(8)
  @Matches(PASSWORD_COMPLEXITY.LETTER.PATTERN, {
    message: PASSWORD_COMPLEXITY.LETTER.MESSAGE,
  })
  @Matches(PASSWORD_COMPLEXITY.NUMBER.PATTERN, {
    message: PASSWORD_COMPLEXITY.NUMBER.MESSAGE,
  })
  @Matches(PASSWORD_COMPLEXITY.SPECIAL_CHARACTER.PATTERN, {
    message: PASSWORD_COMPLEXITY.SPECIAL_CHARACTER.MESSAGE,
  })
  declare password: string;

  @ApiProperty({
    example: AUTH_SWAGGER.SIGN_UP.BODY.NAME.EXAMPLE,
    description: AUTH_SWAGGER.SIGN_UP.BODY.NAME.DESCRIPTION,
  })
  @IsString()
  @MinLength(1)
  declare name: string;

  @ApiProperty({
    enum: AUTH_SWAGGER.SIGN_UP.BODY.ROLE.ENUM,
    example: AUTH_SWAGGER.SIGN_UP.BODY.ROLE.EXAMPLE,
    description: AUTH_SWAGGER.SIGN_UP.BODY.ROLE.DESCRIPTION,
  })
  @IsEnum(UserRole)
  declare role: UserRole;
}
