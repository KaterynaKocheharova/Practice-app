import type { ComponentProps } from "react";
import type { UserRole } from "@/modules/auth/types";

export interface GoogleOAuthButtonProps
  extends Pick<ComponentProps<"button">, "disabled" | "onClick"> {
  isPending: boolean;
}

export interface GoogleSignUpOAuthButtonProps
  extends Pick<ComponentProps<"button">, "disabled"> {
  role: UserRole;
}
