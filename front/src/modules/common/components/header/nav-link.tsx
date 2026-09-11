"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLinkVariant } from "../../common.enums";
import { cn } from "@/modules/common/utils";
import { navLinkStyles } from "./style";
import type { NavLinkProps } from "./types";

export const NavLink = ({
  className,
  href,
  variant = NavLinkVariant.Secondary,
  ...props
}: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = typeof href === "string" && pathname === href;

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={cn(
        navLinkStyles.root,
        navLinkStyles.variant[variant],
        isActive && navLinkStyles.active,
        className,
      )}
      href={href}
      {...props}
    />
  );
};
