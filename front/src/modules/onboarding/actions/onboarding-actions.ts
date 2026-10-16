"use server";

import { refresh } from "next/cache";
import { API_ROUTES, type ServerApiResponse } from "@/modules/common/api";
import { serverApiRequest } from "@/modules/common/api/server-api-request";
import { HttpMethod } from "@/modules/common/common.enums";
import type { CompleteOnboardingRequest } from "../types";

export const completeOnboardingAction = async (
  data: CompleteOnboardingRequest,
): Promise<ServerApiResponse<void>> => {
  const response = await serverApiRequest<void>(API_ROUTES.ONBOARDING, {
    body: data,
    method: HttpMethod.Post,
  });

  if (response.ok) {
    refresh();
  }

  return response;
};
