import type { ComponentProps } from "react";

export interface GoogleOAuthButtonProps
  extends Pick<ComponentProps<"button">, "disabled" | "onClick"> {
  isPending: boolean;
}

export interface GoogleSignInOAuthButtonProps
  extends Pick<ComponentProps<"button">, "disabled"> {
  /** `null` when the backend URL is not configured. */
  oauthUrl: string | null;
}
