"use client";

import { LogIn } from "lucide-react";
import { Button } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { googleOAuthButtonStyles } from "./style";
import type { GoogleOAuthButtonProps } from "./types";

export const GoogleOAuthButton = ({
  disabled,
  isPending,
  onClick,
}: GoogleOAuthButtonProps) => (
  <Button
    aria-label={TEXTS.AUTH.CONTINUE_WITH_GOOGLE}
    className={googleOAuthButtonStyles.button}
    disabled={disabled || isPending}
    onClick={onClick}
    type="button"
    variant="secondary"
  >
    <LogIn aria-hidden="true" className={googleOAuthButtonStyles.icon} />
    {isPending ? TEXTS.AUTH.SIGNING_IN_WITH_GOOGLE : TEXTS.AUTH.CONTINUE_WITH_GOOGLE}
  </Button>
);
