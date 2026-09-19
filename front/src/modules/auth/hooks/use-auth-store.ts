"use client";

import { useAuthStore } from "../state";

export function useAuth() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return { currentUser, isAuthenticated };
}
