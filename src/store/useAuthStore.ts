/**
 * Store de Autenticação (Zustand)
 * Gerencia estado global do usuário e sessão
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserWorkspace } from "@/types/auth";

interface AuthState {
  // Estado
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  workspaces: UserWorkspace[];
  _hasHydrated: boolean;

  // Ações
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setWorkspaces: (workspaces: UserWorkspace[]) => void;
  clearAuth: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Estado inicial
      user: null,
      token: null,
      isAuthenticated: false,
      workspaces: [],
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      // Ações
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setToken: (token) => {
        if (token) {
          localStorage.setItem("token", token);
        } else {
          localStorage.removeItem("token");
        }
        set({ token });
      },

      setWorkspaces: (workspaces) =>
        set({
          workspaces,
        }),

      clearAuth: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("activeWorkspace");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          workspaces: [],
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        workspaces: state.workspaces,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
