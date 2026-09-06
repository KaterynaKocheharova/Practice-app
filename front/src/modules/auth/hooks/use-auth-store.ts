"use client";

import { useAuthStore } from "../state";

export function useAuth() {
  return useAuthStore();
}
