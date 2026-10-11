import { ToasterProvider } from "../toaster-provider/toaster-provider";
import type { AppProvidersProps } from "./types";

export const AppProviders = ({ children }: AppProvidersProps) => (
  <>
    {children}
    <ToasterProvider />
  </>
);
