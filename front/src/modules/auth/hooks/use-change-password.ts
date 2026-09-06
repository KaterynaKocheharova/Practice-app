"use client";

import { useMutation } from "@tanstack/react-query";
import { getQueryClient } from "@/modules/common/api";
import { AUTH_QUERY_KEYS, changePassword } from "../api";
import { useAuthStore } from "../state";

export function useChangePassword() {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: changePassword,
    onSettled: () => {
      clearAuth();
      getQueryClient().removeQueries({ queryKey: AUTH_QUERY_KEYS.currentUser });
    },
  });
}
