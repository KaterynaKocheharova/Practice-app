import type { ComponentProps } from "react";
import Link from "next/link";
import type { UserRole } from "@/modules/auth/auth.enums";
import type { CurrentUser } from "@/modules/auth/types";
import type { NavLinkVariant } from "../../common.enums";

export interface HeaderProps {
  currentUser: CurrentUser | null;
}

export interface NavLinkProps extends ComponentProps<typeof Link> {
  variant?: NavLinkVariant;
}

export interface PrimaryNavLink {
  href: string;
  label: string;
  roles: UserRole[];
}

export type SidebarLinkProps = ComponentProps<typeof Link>;
