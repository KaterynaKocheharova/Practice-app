"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { TEXTS } from "@/modules/common/constants";
import { cn } from "@/modules/common/utils";
import { Button } from "../button/button";
import { FormErrorMessage } from "../form-error-message/form-error-message";
import { Input } from "../input/input";
import { Label } from "../label/label";
import { passwordFieldStyles } from "./style";
import type { PasswordFieldProps } from "./types";

export const PasswordField = ({
  className,
  errorId,
  errorMessage,
  id,
  label,
  ...props
}: PasswordFieldProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const ToggleIcon = isPasswordVisible ? EyeOff : Eye;

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((currentValue) => !currentValue);
  };

  return (
    <div className={passwordFieldStyles.field}>
      <Label htmlFor={id}>{label}</Label>
      <div className={passwordFieldStyles.inputWrapper}>
        <Input
          className={cn(passwordFieldStyles.input, className)}
          id={id}
          type={isPasswordVisible ? "text" : "password"}
          {...props}
        />
        <Button
          aria-label={
            isPasswordVisible
              ? TEXTS.AUTH.HIDE_PASSWORD
              : TEXTS.AUTH.SHOW_PASSWORD
          }
          className={passwordFieldStyles.toggle}
          onClick={handleTogglePasswordVisibility}
          size="sm"
          type="button"
          variant="ghost"
        >
          <ToggleIcon aria-hidden="true" className={passwordFieldStyles.icon} />
        </Button>
      </div>
      <FormErrorMessage id={errorId} message={errorMessage} />
    </div>
  );
};
