import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Matches,
  MinLength,
  Validate,
  type ValidationArguments,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator';
import { CHANGE_PASSWORD_SWAGGER } from 'src/constant/swagger/auth/change-password.swagger';
import { PASSWORD_COMPLEXITY } from 'src/common/constants/password-complexity.constant';

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
  @Matches(PASSWORD_COMPLEXITY.LETTER.PATTERN, {
    message: PASSWORD_COMPLEXITY.LETTER.MESSAGE,
  })
  @Matches(PASSWORD_COMPLEXITY.NUMBER.PATTERN, {
    message: PASSWORD_COMPLEXITY.NUMBER.MESSAGE,
  })
  @Matches(PASSWORD_COMPLEXITY.SPECIAL_CHARACTER.PATTERN, {
    message: PASSWORD_COMPLEXITY.SPECIAL_CHARACTER.MESSAGE,
  })
  @Validate(IsDifferentFromCurrentPasswordConstraint)
  declare newPassword: string;
}
