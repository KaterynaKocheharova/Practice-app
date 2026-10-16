import type { UserRole } from "../auth.enums";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role: UserRole | null;
}

export type OnboardedUser = CurrentUser & { role: UserRole };
