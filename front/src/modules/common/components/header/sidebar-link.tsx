import Link from "next/link";
import { cn } from "@/modules/common/utils";
import { sidebarLinkStyles } from "./style";
import type { SidebarLinkProps } from "./types";

export const SidebarLink = ({
  className,
  ...props
}: SidebarLinkProps) => (
  <Link className={cn(sidebarLinkStyles.root, className)} {...props} />
);
