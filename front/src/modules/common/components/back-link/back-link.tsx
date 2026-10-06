import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "../button-link/button-link";
import { backLinkStyles } from "./style";
import type { BackLinkProps } from "./types";

export const BackLink = ({ href, label }: BackLinkProps) => (
  <ButtonLink
    className={backLinkStyles.root}
    href={href}
    size="sm"
    variant="ghost"
  >
    <ArrowLeft aria-hidden="true" className={backLinkStyles.icon} />
    {label}
  </ButtonLink>
);
