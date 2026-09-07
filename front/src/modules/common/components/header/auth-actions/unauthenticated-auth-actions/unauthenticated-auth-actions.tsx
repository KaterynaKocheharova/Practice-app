import { NavLink } from "../../nav-link";
import { authNavLinks } from "../../constants";
import { unauthenticatedAuthActionsStyles } from "./style";
import type { UnauthenticatedAuthActionsProps } from "../types";

export const UnauthenticatedAuthActions = ({
  stacked,
}: UnauthenticatedAuthActionsProps) => (
  <div className={unauthenticatedAuthActionsStyles.root(stacked)}>
    {authNavLinks.map(({ href, label, variant }) => (
      <NavLink href={href} key={href} variant={variant}>
        {label}
      </NavLink>
    ))}
  </div>
);
