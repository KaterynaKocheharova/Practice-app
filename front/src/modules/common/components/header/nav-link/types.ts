import type { ComponentProps } from "react";
import type Link from "next/link";
import type { NavLinkVariant } from "../../../common.enums";

export interface NavLinkProps extends ComponentProps<typeof Link> {
  variant?: NavLinkVariant;
}
