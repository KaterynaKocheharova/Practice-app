"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/modules/common/utils";
import { sidebarLinkStyles } from "./style";
import type { SidebarLinkProps } from "./types";

export const SidebarLink = ({
  className,
  href,
  ...props
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = typeof href === "string" && pathname === href;

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={cn(
        sidebarLinkStyles.root,
        isActive && sidebarLinkStyles.active,
        className,
      )}
      href={href}
      {...props}
    />
  );
};
