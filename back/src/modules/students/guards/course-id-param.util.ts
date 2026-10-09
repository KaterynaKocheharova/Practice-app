import { ParseUUIDPipe } from '@nestjs/common';
import type { AuthenticatedRequest } from 'src/common/auth';
import { API_ROUTES } from 'src/common/constants';

const { COURSE_ID } = API_ROUTES.STUDENTS.PARAMS;

export const parseCourseIdParam = (
  request: AuthenticatedRequest,
): Promise<string> =>
  new ParseUUIDPipe().transform(request.params[COURSE_ID] as string, {
    type: 'param',
    data: COURSE_ID,
  });
