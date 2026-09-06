"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { AUTH_QUERY_KEYS, getCurrentUser } from "../api";
import { useAuthStore } from "../state";

export function useCurrentUser() {
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const query = useQuery({
    queryKey: AUTH_QUERY_KEYS.currentUser,
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

  return query;
}
