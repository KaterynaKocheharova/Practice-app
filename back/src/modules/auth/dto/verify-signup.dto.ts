import { IsString, MinLength } from 'class-validator';

export class VerifySignupDto {
  @IsString()
  @MinLength(32)
  declare token: string;
}
