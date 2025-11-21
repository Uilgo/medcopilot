/**
 * Tipos de resposta da API Backend
 */

// Resposta padrão de sucesso
export interface ApiResponse<T = unknown> {
  message: string;
  data: T;
}

// Resposta com paginação
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Resposta de erro
export interface ApiError {
  status: "error";
  message: string;
  details?: Record<string, string | string[]>;
}

// Resposta de Login
export interface LoginResponse {
  message: string;
  data: {
    user: {
      id: string;
      nome: string;
      sobrenome: string | null;
      email: string;
      avatar_url: string | null;
      especialidade: string | null;
      crm: string | null;
      onboarding: boolean;
    };
    session: {
      access_token: string;
      refresh_token: string;
      expires_in: number;
    };
    workspaces: Array<{
      id: string;
      slug: string;
      nome: string;
      logo_url: string | null;
      role: "ADMIN" | "PROFESSIONAL" | "STAFF";
      status_assinatura: "trial" | "active" | "suspended" | "cancelled";
    }>;
    onboarding_completo: boolean;
  };
}

// Resposta de Signup
export interface SignupResponse {
  message: string;
  data: {
    user: {
      id: string;
      nome: string;
      sobrenome: string | null;
      email: string;
      onboarding: boolean;
    };
    session: {
      access_token: string;
      refresh_token: string;
      expires_in: number;
    };
  };
}

// Resposta de Onboarding
export interface OnboardingResponse {
  message: string;
  data: {
    workspace: {
      id: string;
      slug: string;
      nome: string;
      owner_id: string;
      status_assinatura: string;
    };
  };
}

// Parâmetros de paginação
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Parâmetros de busca
export interface SearchParams extends PaginationParams {
  search?: string;
  q?: string;
}

// Parâmetros de filtro de consultas
export interface ConsultationFilters extends PaginationParams {
  paciente_id?: string;
  profissional_id?: string;
  data_inicio?: string;
  data_fim?: string;
}
