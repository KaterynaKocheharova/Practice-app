"use client";

import { useMutation } from "@tanstack/react-query";
import { getQueryClient } from "@/modules/common/api";
import { AUTH_CONFIG } from "../auth.config";
import { getCurrentUser, verifySignin } from "../api";
import { useAuthStore } from "../state";

export function useVerifySignin() {
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  return useMutation({
    mutationFn: verifySignin,
    onSuccess: async () => {
      const currentUser = await getCurrentUser();
      setCurrentUser(currentUser);
      getQueryClient().setQueryData(
        AUTH_CONFIG.queryKeys.currentUser,
        currentUser,
      );
    },
  });
}
