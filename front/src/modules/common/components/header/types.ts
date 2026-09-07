import type { ComponentProps } from "react";
import Link from "next/link";
import type { CurrentUser } from "@/modules/auth/types";

export interface HeaderProps {
  initialUser: CurrentUser | null;
}

export type NavLinkVariant = "primary" | "secondary";

export interface NavLinkProps extends ComponentProps<typeof Link> {
  variant?: NavLinkVariant;
}

export type SidebarLinkProps = ComponentProps<typeof Link>;
