/**
 * Hook de Autenticação
 * Gerencia login, signup, logout e estado do usuário
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import type { User, UserWorkspace, SignupData, LoginData, OnboardingData } from "@/types/auth";

interface UseAuthReturn {
  user: User | null;
  workspaces: UserWorkspace[];
  isAuthenticated: boolean;
  isLoading: boolean;
  signup: (data: SignupData) => void;
  login: (data: LoginData) => void;
  logout: () => void;
  forgotPassword: (email: string) => void;
  resetPassword: (data: { token: string; newPassword: string }) => void;
  onboarding: (data: OnboardingData) => void;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isCompletingOnboarding: boolean;
  signupError: Error | null;
  loginError: Error | null;
  onboardingError: Error | null;
}

export const useAuth = (): UseAuthReturn => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUser, setToken, setWorkspaces, clearAuth, isAuthenticated, user, workspaces } =
    useAuthStore();

  // Mutation: Signup
  const signupMutation = useMutation({
    mutationFn: authService.signup,
    onSuccess: (data) => {
      setToken(data.data.session.access_token);
      setUser(data.data.user as User);

      // Redirecionar para onboarding
      navigate("/onboarding");
    },
  });

  // Mutation: Login
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setToken(data.data.session.access_token);
      setUser(data.data.user as User);
      setWorkspaces(data.data.workspaces as UserWorkspace[]);

      // Verificar onboarding
      if (!data.data.onboarding_completo) {
        navigate("/onboarding");
      } else if (data.data.workspaces.length > 0) {
        // Redirecionar para primeiro workspace
        navigate(`/${data.data.workspaces[0].slug}/dashboard`);
      } else {
        // Sem workspaces, redirecionar para criar
        navigate("/onboarding");
      }
    },
  });

  // Mutation: Logout
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear(); // Limpar todo o cache
      navigate("/login");
    },
  });

  // Mutation: Forgot Password
  const forgotPasswordMutation = useMutation({
    mutationFn: authService.forgotPassword,
  });

  // Mutation: Reset Password
  const resetPasswordMutation = useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      authService.resetPassword(token, newPassword),
    onSuccess: () => {
      navigate("/login");
    },
  });

  // Mutation: Onboarding
  const onboardingMutation = useMutation({
    mutationFn: authService.onboarding,
    onSuccess: (data) => {
      // Atualizar store com workspace criado
      // O backend retorna o workspace sem logo_url e role, então precisamos adicionar
      const workspace: UserWorkspace = {
        id: data.data.workspace.id,
        slug: data.data.workspace.slug,
        nome: data.data.workspace.nome,
        logo_url: null, // Backend não retorna logo_url no onboarding
        role: "ADMIN", // Owner sempre é ADMIN
        status_assinatura: data.data.workspace.status_assinatura as
          | "trial"
          | "active"
          | "suspended"
          | "cancelled",
      };
      setWorkspaces([workspace]);

      // Redirecionar para dashboard do workspace criado
      navigate(`/${data.data.workspace.slug}/dashboard`);
    },
  });

  return {
    // Estado (do Zustand store)
    user,
    workspaces,
    isAuthenticated,
    isLoading: false, // Não há mais queries automáticas

    // Mutations
    signup: signupMutation.mutate,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    onboarding: onboardingMutation.mutate,

    // Loading states
    isSigningUp: signupMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isCompletingOnboarding: onboardingMutation.isPending,

    // Error states
    signupError: signupMutation.error,
    loginError: loginMutation.error,
    onboardingError: onboardingMutation.error,
  };
};
