import { cn } from "@/modules/common/utils";
import { loaderStyles } from "./style";
import type { LoaderProps } from "./types";

export const Loader = ({
  className,
  variant = "skeleton",
  ...props
}: LoaderProps) => (
  <div
    aria-hidden="true"
    className={cn(loaderStyles.root, loaderStyles.variant[variant], className)}
    {...props}
  />
);
