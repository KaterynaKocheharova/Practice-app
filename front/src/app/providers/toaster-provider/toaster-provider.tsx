"use client";

import { Toaster } from "sonner";
import { toasterProviderStyles } from "./style";

export const ToasterProvider = () => (
  <Toaster position={toasterProviderStyles.position} richColors />
);
