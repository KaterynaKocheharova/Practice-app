import { cn } from "@/modules/common/utils";
import { buttonStyles } from "./style";
import type { ButtonProps } from "./types";

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        buttonStyles.root,
        buttonStyles.variant[variant],
        buttonStyles.size[size],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
