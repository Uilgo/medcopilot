/**
 * Componente de redirect inteligente para rota raiz
 */

import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useWorkspace } from "@/hooks/useWorkspace";

export const RootRedirect = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const activeWorkspace = useWorkspace();

  if (isAuthenticated && activeWorkspace?.slug) {
    return <Navigate to={`/${activeWorkspace.slug}/dashboard`} replace />;
  }

  if (isAuthenticated) {
    // Se autenticado mas sem workspace, vai para onboarding
    return <Navigate to="/onboarding" replace />;
  }

  return <Navigate to="/login" replace />;
};
