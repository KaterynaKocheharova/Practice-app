import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  Validate,
  type ValidationArguments,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator';
import { CHANGE_PASSWORD_SWAGGER } from 'src/constant/swagger/auth/change-password.swagger';

@ValidatorConstraint({ name: 'isDifferentFromCurrentPassword' })
class IsDifferentFromCurrentPasswordConstraint implements ValidatorConstraintInterface {
  validate(newPassword: string, args: ValidationArguments): boolean {
    const dto = args.object as ChangePasswordDto;

    return dto.currentPassword !== newPassword;
  }

  defaultMessage(): string {
    return 'newPassword must be different from currentPassword';
  }
}

export class ChangePasswordDto {
  @ApiProperty({
    example: CHANGE_PASSWORD_SWAGGER.BODY.CURRENT_PASSWORD.EXAMPLE,
    description: CHANGE_PASSWORD_SWAGGER.BODY.CURRENT_PASSWORD.DESCRIPTION,
    minLength: CHANGE_PASSWORD_SWAGGER.BODY.CURRENT_PASSWORD.MIN_LENGTH,
    writeOnly: CHANGE_PASSWORD_SWAGGER.BODY.CURRENT_PASSWORD.WRITE_ONLY,
  })
  @IsString()
  @MinLength(8)
  declare currentPassword: string;

  @ApiProperty({
    example: CHANGE_PASSWORD_SWAGGER.BODY.NEW_PASSWORD.EXAMPLE,
    description: CHANGE_PASSWORD_SWAGGER.BODY.NEW_PASSWORD.DESCRIPTION,
    minLength: CHANGE_PASSWORD_SWAGGER.BODY.NEW_PASSWORD.MIN_LENGTH,
    writeOnly: CHANGE_PASSWORD_SWAGGER.BODY.NEW_PASSWORD.WRITE_ONLY,
  })
  @IsString()
  @MinLength(8)
  @Validate(IsDifferentFromCurrentPasswordConstraint)
  declare newPassword: string;
}
