import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Validate,
  ValidateNested,
  type ValidationArguments,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator';
import { CreateStudentDto } from 'src/modules/students/dto';
import { COMPLETE_ONBOARDING_SWAGGER } from 'src/constant/swagger/onboarding/complete-onboarding.swagger';
import { UserRole } from 'src/modules/users/enums';
import { onboardingConfig } from '../config';

const { VALIDATION } = onboardingConfig;
const { BODY } = COMPLETE_ONBOARDING_SWAGGER;

@ValidatorConstraint({ name: 'isStudentProfileAllowed' })
class IsStudentProfileAllowedConstraint implements ValidatorConstraintInterface {
  validate(_student: unknown, args: ValidationArguments): boolean {
    return (args.object as CompleteOnboardingDto).role === UserRole.Student;
  }

  defaultMessage(): string {
    return `student is allowed only when role is ${UserRole.Student}`;
  }
}

export class OnboardingStudentProfileDto extends PickType(CreateStudentDto, [
  'birthDate',
  'job',
  'hobbies',
] as const) {}

export class CompleteOnboardingDto {
  @ApiProperty({
    example: BODY.NAME.EXAMPLE,
    description: BODY.NAME.DESCRIPTION,
    maxLength: VALIDATION.NAME_MAX_LENGTH,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(VALIDATION.NAME_MAX_LENGTH)
  declare name: string;

  @ApiProperty({
    enum: UserRole,
    example: BODY.ROLE.EXAMPLE,
    description: BODY.ROLE.DESCRIPTION,
  })
  @IsEnum(UserRole)
  declare role: UserRole;

  @ApiPropertyOptional({
    type: OnboardingStudentProfileDto,
    description: BODY.STUDENT.DESCRIPTION,
  })
  @IsOptional()
  @Validate(IsStudentProfileAllowedConstraint)
  @ValidateNested()
  @Type(() => OnboardingStudentProfileDto)
  declare student?: OnboardingStudentProfileDto;
}
