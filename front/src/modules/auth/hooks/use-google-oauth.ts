"use client";

import { useMutation } from "@tanstack/react-query";
import { createGoogleOAuthUrl } from "../api";
import type { GoogleOAuthRequest } from "../types";

export function useGoogleOAuth() {
  return useMutation({
    mutationFn: async (data: GoogleOAuthRequest) => {
      window.location.assign(createGoogleOAuthUrl(data));
    },
  });
}
