import Link from "next/link";
import { authFooterLinkStyles } from "./style";
import type { AuthFooterLinkProps } from "./types";

export const AuthFooterLink = ({ href, label, prompt }: AuthFooterLinkProps) => (
  <p className={authFooterLinkStyles.root}>
    {prompt}{" "}
    <Link className={authFooterLinkStyles.link} href={href}>
      {label}
    </Link>
  </p>
);
