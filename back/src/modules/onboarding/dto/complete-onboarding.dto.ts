import { PickType } from '@nestjs/swagger';
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
import { UserRole } from 'src/modules/users/enums';
import { onboardingConfig } from '../config';

const { VALIDATION } = onboardingConfig;

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
  @IsString()
  @MinLength(1)
  @MaxLength(VALIDATION.NAME_MAX_LENGTH)
  declare name: string;

  @IsEnum(UserRole)
  declare role: UserRole;

  @IsOptional()
  @Validate(IsStudentProfileAllowedConstraint)
  @ValidateNested()
  @Type(() => OnboardingStudentProfileDto)
  declare student?: OnboardingStudentProfileDto;
}
