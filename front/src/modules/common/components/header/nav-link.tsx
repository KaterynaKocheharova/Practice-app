import Link from "next/link";
import { cn } from "@/modules/common/utils";
import { navLinkStyles } from "./style";
import type { NavLinkProps } from "./types";

export const NavLink = ({
  className,
  variant = "secondary",
  ...props
}: NavLinkProps) => (
  <Link
    className={cn(navLinkStyles.root, navLinkStyles.variant[variant], className)}
    {...props}
  />
);
