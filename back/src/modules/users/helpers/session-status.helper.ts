import { UserStatus } from '../enums';

export const isSessionAllowedStatus = (status: UserStatus): boolean =>
  status === UserStatus.Active || status === UserStatus.Onboarding;
