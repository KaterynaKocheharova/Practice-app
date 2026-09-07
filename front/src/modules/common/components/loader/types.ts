import type { ComponentProps } from "react";

export type LoaderVariant = "skeleton";

export interface LoaderProps extends ComponentProps<"div"> {
  variant?: LoaderVariant;
}
