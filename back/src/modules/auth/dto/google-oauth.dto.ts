import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { GOOGLE_OAUTH_SWAGGER } from 'src/constant/swagger/auth/google-oauth.swagger';
import { UserRole } from 'src/modules/users/enums';

export class GoogleSignUpOAuthQueryDto {
  @ApiProperty({
    enum: GOOGLE_OAUTH_SWAGGER.SIGN_UP_START.QUERY.ROLE.ENUM,
    example: GOOGLE_OAUTH_SWAGGER.SIGN_UP_START.QUERY.ROLE.EXAMPLE,
    description: GOOGLE_OAUTH_SWAGGER.SIGN_UP_START.QUERY.ROLE.DESCRIPTION,
  })
  @IsEnum(UserRole)
  declare role: UserRole;
}

export class GoogleOAuthCallbackQueryDto {
  @ApiPropertyOptional({
    example: GOOGLE_OAUTH_SWAGGER.CALLBACK.QUERY.CODE.EXAMPLE,
    description: GOOGLE_OAUTH_SWAGGER.CALLBACK.QUERY.CODE.DESCRIPTION,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  declare code?: string;

  @ApiPropertyOptional({
    example: GOOGLE_OAUTH_SWAGGER.CALLBACK.QUERY.STATE.EXAMPLE,
    description: GOOGLE_OAUTH_SWAGGER.CALLBACK.QUERY.STATE.DESCRIPTION,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  declare state?: string;

  @ApiPropertyOptional({
    example: GOOGLE_OAUTH_SWAGGER.CALLBACK.QUERY.ERROR.EXAMPLE,
    description: GOOGLE_OAUTH_SWAGGER.CALLBACK.QUERY.ERROR.DESCRIPTION,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  declare error?: string;

  @ApiPropertyOptional({
    example: GOOGLE_OAUTH_SWAGGER.CALLBACK.QUERY.ERROR_DESCRIPTION.EXAMPLE,
    description:
      GOOGLE_OAUTH_SWAGGER.CALLBACK.QUERY.ERROR_DESCRIPTION.DESCRIPTION,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  declare error_description?: string;

  @ApiPropertyOptional({
    example: GOOGLE_OAUTH_SWAGGER.CALLBACK.QUERY.SCOPE.EXAMPLE,
    description: GOOGLE_OAUTH_SWAGGER.CALLBACK.QUERY.SCOPE.DESCRIPTION,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  declare scope?: string;

  @ApiPropertyOptional({
    example: GOOGLE_OAUTH_SWAGGER.CALLBACK.QUERY.AUTHUSER.EXAMPLE,
    description: GOOGLE_OAUTH_SWAGGER.CALLBACK.QUERY.AUTHUSER.DESCRIPTION,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  declare authuser?: string;

  @ApiPropertyOptional({
    example: GOOGLE_OAUTH_SWAGGER.CALLBACK.QUERY.PROMPT.EXAMPLE,
    description: GOOGLE_OAUTH_SWAGGER.CALLBACK.QUERY.PROMPT.DESCRIPTION,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  declare prompt?: string;

  @ApiPropertyOptional({
    example: GOOGLE_OAUTH_SWAGGER.CALLBACK.QUERY.ISS.EXAMPLE,
    description: GOOGLE_OAUTH_SWAGGER.CALLBACK.QUERY.ISS.DESCRIPTION,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  declare iss?: string;
}

export class GoogleOAuthExchangeDto {
  @IsString()
  @MinLength(1)
  declare code: string;
}
