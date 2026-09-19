import { authFormShellStyles } from "./style";
import type { AuthFormShellProps } from "./types";

export const AuthFormShell = ({
  children,
  description,
  title,
}: AuthFormShellProps) => (
  <div className={authFormShellStyles.root}>
    <div className={authFormShellStyles.header}>
      <h1 className={authFormShellStyles.title}>{title}</h1>
      <p className={authFormShellStyles.description}>{description}</p>
    </div>
    {children}
  </div>
);
