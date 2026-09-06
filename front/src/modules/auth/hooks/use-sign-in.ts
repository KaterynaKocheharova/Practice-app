"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn } from "../api";

export function useSignIn() {
  return useMutation({
    mutationFn: signIn,
  });
}
