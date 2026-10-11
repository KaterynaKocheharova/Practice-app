import type { VerifyAuthRequest } from "@/modules/auth/types";
import type { ServerApiResponse } from "@/modules/common/api";

export interface VerificationProps {
  fallbackErrorMessage: string;
  successMessage: string;
  token?: string;
  verify: (data: VerifyAuthRequest) => Promise<ServerApiResponse<unknown>>;
}
