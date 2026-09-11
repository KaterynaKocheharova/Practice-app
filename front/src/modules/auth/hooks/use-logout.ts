"use client";

import { useMutation, type MutateOptions } from "@tanstack/react-query";
import { getQueryClient } from "@/modules/common/api";
import { AUTH_CONFIG } from "../auth.config";
import { logout } from "../api";
import { useAuthStore } from "../state";

type LogoutOptions = MutateOptions<void, Error, void>;

export const useLogout = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const mutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearAuth();
      getQueryClient().removeQueries({
        queryKey: AUTH_CONFIG.queryKeys.currentUser,
      });
    },
  });

  return {
    ...mutation,
    logout: (options?: LogoutOptions) => mutation.mutate(undefined, options),
  };
};
