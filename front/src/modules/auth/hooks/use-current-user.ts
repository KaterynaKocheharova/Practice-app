"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { AUTH_CONFIG } from "../auth.config";
import { getCurrentUser } from "../api";
import { useAuthStore } from "../state";
import type { CurrentUser } from "../types";

export const useCurrentUser = (initialUser: CurrentUser | null = null) => {
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const query = useQuery({
    queryKey: AUTH_CONFIG.queryKeys.currentUser,
    queryFn: getCurrentUser,
    retry: false,
    throwOnError: false,
  });

  useEffect(() => {
    if (query.data) {
      setCurrentUser(query.data);
      return;
    }

    if (query.isError) {
      clearAuth();
    }
  }, [clearAuth, query.data, query.isError, setCurrentUser]);

  const currentUser = query.isError ? null : (query.data ?? initialUser);

  return {
    ...query,
    currentUser,
    displayName: currentUser?.name || currentUser?.email,
    isAuthenticated: currentUser !== null,
    isAuthLoading: !currentUser && query.isLoading,
  };
};
