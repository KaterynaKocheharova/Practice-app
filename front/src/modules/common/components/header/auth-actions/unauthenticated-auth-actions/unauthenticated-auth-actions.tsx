import { COMMON_CONFIG } from "@/modules/common/common.config";
import { NavLink } from "../../nav-link/nav-link";
import { unauthenticatedAuthActionsStyles } from "./style";
import type { UnauthenticatedAuthActionsProps } from "../types";

export const UnauthenticatedAuthActions = ({
  stacked,
}: UnauthenticatedAuthActionsProps) => (
  <div className={unauthenticatedAuthActionsStyles.root(stacked)}>
    {COMMON_CONFIG.header.authNavLinks.map(({ href, label, variant }) => (
      <NavLink href={href} key={href} variant={variant}>
        {label}
      </NavLink>
    ))}
  </div>
);
