import { ParseUUIDPipe } from '@nestjs/common';
import type { AuthenticatedRequest } from 'src/common/auth';
import { API_ROUTES } from 'src/common/constants';

const { DOCUMENT_ID } = API_ROUTES.STUDENTS.PARAMS;

export const parseDocumentIdParam = (
  request: AuthenticatedRequest,
): Promise<string> =>
  new ParseUUIDPipe().transform(request.params[DOCUMENT_ID] as string, {
    type: 'param',
    data: DOCUMENT_ID,
  });
