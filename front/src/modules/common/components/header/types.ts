import type { UserRole } from "@/modules/auth/auth.enums";
import type { CurrentUser } from "@/modules/auth/types";

export interface HeaderProps {
  currentUser: CurrentUser | null;
}

export interface PrimaryNavLink {
  href: string;
  label: string;
  roles: UserRole[];
}
