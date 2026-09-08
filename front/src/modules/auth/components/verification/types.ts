import type { VerifyAuthRequest } from "@/modules/auth/types";

export interface VerificationProps {
  fallbackErrorMessage: string;
  successMessage: string;
  token?: string;
  verify: (data: VerifyAuthRequest) => Promise<unknown>;
}
