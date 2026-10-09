import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  Validate,
  type ValidationArguments,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator';

import { CREATE_MEDIA_ASSET_UPLOAD_URL_SWAGGER } from 'src/constant/swagger/media-assets/create-media-asset-upload-url.swagger';
import { mediaAssetsConfig } from '../config';

const { ALLOWED_MIME_TYPES, MAX_SIZE_BYTES, VALIDATION } = mediaAssetsConfig;
const { BODY } = CREATE_MEDIA_ASSET_UPLOAD_URL_SWAGGER;

/** The size limit depends on the kind the declared `mimeType` maps to. */
@ValidatorConstraint({ name: 'isWithinMediaAssetSizeLimit' })
class IsWithinMediaAssetSizeLimitConstraint implements ValidatorConstraintInterface {
  validate(sizeBytes: number, args: ValidationArguments): boolean {
    const maxSizeBytes = this.getMaxSizeBytes(args);

    // An unsupported mimeType is reported by its own @IsIn check.
    return maxSizeBytes === null || sizeBytes <= maxSizeBytes;
  }

  defaultMessage(args: ValidationArguments): string {
    return `sizeBytes must not exceed ${this.getMaxSizeBytes(args)} bytes for this mimeType`;
  }

  private getMaxSizeBytes(args: ValidationArguments): number | null {
    const { mimeType } = args.object as CreateMediaAssetUploadUrlDto;
    const kind = ALLOWED_MIME_TYPES[mimeType];

    return kind ? MAX_SIZE_BYTES[kind] : null;
  }
}

/** The file the client is about to upload. */
export class CreateMediaAssetUploadUrlDto {
  @ApiProperty({
    example: BODY.FILE_NAME.EXAMPLE,
    description: BODY.FILE_NAME.DESCRIPTION,
    maxLength: VALIDATION.FILE_NAME_MAX_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(VALIDATION.FILE_NAME_MAX_LENGTH)
  declare fileName: string;

  @ApiProperty({
    enum: Object.keys(ALLOWED_MIME_TYPES),
    example: BODY.MIME_TYPE.EXAMPLE,
    description: BODY.MIME_TYPE.DESCRIPTION,
  })
  @IsIn(Object.keys(ALLOWED_MIME_TYPES))
  declare mimeType: string;

  @ApiProperty({
    example: BODY.SIZE_BYTES.EXAMPLE,
    description: BODY.SIZE_BYTES.DESCRIPTION,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @Validate(IsWithinMediaAssetSizeLimitConstraint)
  declare sizeBytes: number;
}
