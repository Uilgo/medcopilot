/**
 * Hook para acessar workspace ativo
 * Retorna o workspace ativo do usuário baseado no localStorage
 * Se não houver workspace ativo salvo, retorna o primeiro da lista
 */

import { useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import type { UserWorkspace } from "@/types/auth";

export const useWorkspace = (): UserWorkspace | null => {
  const workspaces = useAuthStore((state) => state.workspaces);

  const activeWorkspace = useMemo(() => {
    if (!workspaces || workspaces.length === 0) {
      return null;
    }

    // Tentar obter workspace ativo do localStorage
    const activeSlug = localStorage.getItem("activeWorkspace");

    if (activeSlug) {
      const found = workspaces.find((w) => w.slug === activeSlug);
      if (found) {
        return found;
      }
    }

    // Fallback: retornar o primeiro workspace
    return workspaces[0];
  }, [workspaces]);

  return activeWorkspace;
};
