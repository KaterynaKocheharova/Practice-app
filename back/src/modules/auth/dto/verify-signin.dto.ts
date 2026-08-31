import { IsString, MinLength } from 'class-validator';

export class VerifySigninDto {
  @IsString()
  @MinLength(32)
  declare token: string;
}
