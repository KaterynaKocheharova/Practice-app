"use client";

import { useMutation } from "@tanstack/react-query";
import { getQueryClient } from "@/modules/common/api";
import { AUTH_QUERY_KEYS, getCurrentUser, verifySignup } from "../api";
import { useAuthStore } from "../state";

export function useVerifySignup() {
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  return useMutation({
    mutationFn: verifySignup,
    onSuccess: async () => {
      const currentUser = await getCurrentUser();
      setCurrentUser(currentUser);
      getQueryClient().setQueryData(AUTH_QUERY_KEYS.currentUser, currentUser);
    },
  });
}
