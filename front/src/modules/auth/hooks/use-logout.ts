"use client";

import { useMutation } from "@tanstack/react-query";
import { getQueryClient } from "@/modules/common/api";
import { AUTH_QUERY_KEYS, logout } from "../api";
import { useAuthStore } from "../state";

export function useLogout() {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearAuth();
      getQueryClient().removeQueries({ queryKey: AUTH_QUERY_KEYS.currentUser });
    },
  });
}
