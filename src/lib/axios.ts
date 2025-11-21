/**
 * Cliente HTTP configurado com Axios
 * Gerencia autenticação e tratamento de erros
 */

import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

// Criar instância do Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || "30000"),
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de Request - Adicionar token automaticamente
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de Response - Tratar erros globalmente
api.interceptors.response.use(
  (response) => {
    // Retornar resposta de sucesso
    return response;
  },
  (error: AxiosError) => {
    // Tratar erro 401 - Token inválido ou expirado
    if (error.response?.status === 401) {
      // Limpar token
      localStorage.removeItem("token");
      localStorage.removeItem("activeWorkspace");

      // Redirecionar para login (apenas se não estiver já na página de login)
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    // Tratar erro 403 - Sem permissão
    if (error.response?.status === 403) {
      console.error("Acesso negado: Você não tem permissão para esta ação");
    }

    // Tratar erro 404 - Não encontrado
    if (error.response?.status === 404) {
      console.error("Recurso não encontrado");
    }

    // Tratar erro 500 - Erro do servidor
    if (error.response?.status === 500) {
      console.error("Erro interno do servidor");
    }

    return Promise.reject(error);
  }
);

export default api;
