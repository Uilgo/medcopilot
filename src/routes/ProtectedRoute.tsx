/**
 * HOC para proteção de rotas
 * Redireciona para login se não estiver autenticado
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, token, _hasHydrated } = useAuthStore();
  const location = useLocation();

  // Aguardar hidratação do store para evitar flash de redirecionamento
  if (!_hasHydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Verificar tanto o estado do Zustand quanto o localStorage
  const hasToken = token || localStorage.getItem("token");

  if (!isAuthenticated && !hasToken) {
    // Redireciona para login, salvando a rota que tentou acessar
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
