import { authFormWrapperStyles } from "./style";
import type { AuthFormWrapperProps } from "./types";

export const AuthFormWrapper = ({
  children,
  description,
  title,
}: AuthFormWrapperProps) => (
  <div className={authFormWrapperStyles.root}>
    <div className={authFormWrapperStyles.header}>
      <h1 className={authFormWrapperStyles.title}>{title}</h1>
      <p className={authFormWrapperStyles.description}>{description}</p>
    </div>
    {children}
  </div>
);
