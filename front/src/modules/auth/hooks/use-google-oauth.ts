"use client";

import { useMutation } from "@tanstack/react-query";
import {
  createGoogleSignInOAuthUrl,
  createGoogleSignUpOAuthUrl,
} from "../api";
import type { GoogleSignUpOAuthRequest } from "../types";

export function useGoogleSignInOAuth() {
  return useMutation({
    mutationFn: async () => {
      window.location.assign(createGoogleSignInOAuthUrl());
    },
  });
}

export function useGoogleSignUpOAuth() {
  return useMutation({
    mutationFn: async (data: GoogleSignUpOAuthRequest) => {
      window.location.assign(createGoogleSignUpOAuthUrl(data));
    },
  });
}
