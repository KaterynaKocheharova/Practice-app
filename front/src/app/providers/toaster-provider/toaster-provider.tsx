"use client";

import { Toaster } from "sonner";
import { TEXTS } from "@/modules/common/constants";
import { toasterProviderStyles } from "./style";

export const ToasterProvider = () => (
  <Toaster
    closeButton
    position={toasterProviderStyles.position}
    richColors
    toastOptions={{
      ...toasterProviderStyles.toastOptions,
      closeButtonAriaLabel: TEXTS.NAVIGATION.CLOSE_TOAST,
    }}
  />
);
