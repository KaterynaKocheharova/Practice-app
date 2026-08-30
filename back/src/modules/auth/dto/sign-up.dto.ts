import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from 'src/modules/users/enums';

export class SignUpDto {
  @IsEmail()
  declare email: string;

  @IsString()
  @MinLength(8)
  declare password: string;

  @IsString()
  @MinLength(1)
  declare name: string;

  @IsEnum(UserRole)
  declare role: UserRole;
}
