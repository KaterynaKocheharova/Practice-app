import { ParseUUIDPipe } from '@nestjs/common';
import type { AuthenticatedRequest } from 'src/common/auth';
import { API_ROUTES } from 'src/common/constants';

const { STUDENT_ID } = API_ROUTES.STUDENTS.PARAMS;

export const parseStudentIdParam = (
  request: AuthenticatedRequest,
): Promise<string> =>
  new ParseUUIDPipe().transform(request.params[STUDENT_ID] as string, {
    type: 'param',
    data: STUDENT_ID,
  });
