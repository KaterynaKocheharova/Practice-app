import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  declare email: string;

  @IsString()
  @MinLength(8)
  declare password: string;
}
