/**
 * Serviço de Autenticação
 * Gerencia login, signup, logout e onboarding
 */

import api from "@/lib/axios";
import type { ApiResponse, LoginResponse, SignupResponse, OnboardingResponse } from "@/types/api";
import type { SignupData, LoginData, OnboardingData } from "@/types/auth";

export const authService = {
  /**
   * Criar nova conta
   */
  async signup(data: SignupData) {
    const response = await api.post<SignupResponse>("/auth/signup", data);

    // Salvar token no localStorage
    if (response.data.data.session?.access_token) {
      localStorage.setItem("token", response.data.data.session.access_token);
    }

    return response.data;
  },

  /**
   * Login com email e senha
   */
  async login(data: LoginData) {
    const response = await api.post<LoginResponse>("/auth/login", data);

    // Salvar token no localStorage
    if (response.data.data.session?.access_token) {
      localStorage.setItem("token", response.data.data.session.access_token);
    }

    // Salvar workspace ativo (primeiro da lista)
    if (response.data.data.workspaces.length > 0) {
      localStorage.setItem("activeWorkspace", response.data.data.workspaces[0].slug);
    }

    return response.data;
  },

  /**
   * Logout
   */
  async logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      // Limpar dados locais mesmo se a requisição falhar
      localStorage.removeItem("token");
      localStorage.removeItem("activeWorkspace");
    }
  },

  /**
   * Solicitar reset de senha
   */
  async forgotPassword(email: string) {
    const response = await api.post<ApiResponse>("/auth/forgot-password", { email });
    return response.data;
  },

  /**
   * Resetar senha com token
   */
  async resetPassword(token: string, newPassword: string) {
    const response = await api.post<ApiResponse>("/auth/reset-password", {
      token,
      senha: newPassword,
    });
    return response.data;
  },

  /**
   * Obter dados do usuário logado
   */
  async getMe() {
    const response = await api.get<ApiResponse>("/auth/me");
    return response.data;
  },

  /**
   * Obter workspaces do usuário
   */
  async getWorkspaces() {
    const response = await api.get<ApiResponse>("/auth/workspaces");
    return response.data;
  },

  /**
   * Completar onboarding (criar workspace)
   */
  async onboarding(data: OnboardingData) {
    const response = await api.post<OnboardingResponse>("/auth/onboarding", data);

    // Salvar workspace ativo
    if (response.data.data.workspace?.slug) {
      localStorage.setItem("activeWorkspace", response.data.data.workspace.slug);
    }

    return response.data;
  },
};
