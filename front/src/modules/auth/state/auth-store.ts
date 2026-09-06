"use client";

import { create } from "zustand";
import type { CurrentUser } from "../types";

interface AuthState {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  setCurrentUser: (currentUser: CurrentUser | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isAuthenticated: false,
  setCurrentUser: (currentUser) =>
    set({
      currentUser,
      isAuthenticated: currentUser !== null,
    }),
  clearAuth: () =>
    set({
      currentUser: null,
      isAuthenticated: false,
    }),
}));
