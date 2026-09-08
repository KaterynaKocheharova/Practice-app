import { AuthFormWrapperStyles } from "./style";
import type { AuthFormWrapperProps } from "./types";

export const AuthFormWrapper = ({
  children,
  description,
  title,
}: AuthFormWrapperProps) => (
  <div className={AuthFormWrapperStyles.root}>
    <div className={AuthFormWrapperStyles.header}>
      <h1 className={AuthFormWrapperStyles.title}>{title}</h1>
      <p className={AuthFormWrapperStyles.description}>{description}</p>
    </div>
    {children}
  </div>
);
