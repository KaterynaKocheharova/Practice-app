import type { ComponentProps } from "react";

export interface CheckboxProps extends Omit<ComponentProps<"input">, "type"> {
  id: string;
  label: string;
}
