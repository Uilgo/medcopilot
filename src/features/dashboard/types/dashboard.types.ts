/**
 * Tipos para o Dashboard baseados na resposta da API
 */

export interface DashboardStats {
  consultations: {
    total: number;
    today: number;
    this_month: number;
    completed: number;
    in_progress: number;
    cancelled: number;
  };
  patients: {
    total: number;
    active: number;
    new_this_month: number;
  };
  team: {
    total: number;
    active: number;
  };
  chart_data: Array<{
    date: string;
    count: number;
  }>;
  recent_consultations: Array<{
    id: string;
    paciente: {
      nome: string;
    };
    profissional: {
      nome: string;
    };
    queixa_principal: string;

    iniciada_em: string;
    concluida_em: string | null;
  }>;
}
