import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { ERROR_CODE } from '../constants/errors/error-code.constant';
import { hasDefinedValues } from '../helpers';

/**
 * Rejects a partial-update body that changes nothing. Use as
 * `@Body(NonEmptyBodyPipe)`: it runs after the global ValidationPipe, so it
 * sees the whitelisted DTO.
 */
@Injectable()
export class NonEmptyBodyPipe implements PipeTransform<object, object> {
  transform(body: object): object {
    if (!this.hasFields(body)) {
      throw new BadRequestException({
        errorCode: ERROR_CODE.EMPTY_UPDATE_BODY,
      });
    }

    return body;
  }

  private hasFields(body: unknown): body is object {
    return typeof body === 'object' && body !== null && hasDefinedValues(body);
  }
}
