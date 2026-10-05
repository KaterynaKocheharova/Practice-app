import Link from "next/link";
import { cn } from "@/modules/common/utils";
import { buttonStyles } from "../button/style";
import type { ButtonLinkProps } from "./types";

export const ButtonLink = ({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonLinkProps) => (
  <Link
    className={cn(
      buttonStyles.root,
      buttonStyles.variant[variant],
      buttonStyles.size[size],
      className,
    )}
    {...props}
  />
);
