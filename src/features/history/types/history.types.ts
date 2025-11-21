/**
 * Types para feature de histórico
 */

export interface ConsultationHistory {
  id: string;
  workspace_id: string;
  paciente_id: string;
  profissional_id: string;
  queixa_principal: string;
  iniciada_em: string;
  finalizada_em: string | null; // Backend usa finalizada_em
  atualizada_em: string; // Backend usa atualizada_em
  mensagens_count?: number;
  // Relacionamentos
  paciente?: {
    id: string;
    nome: string;
    data_nascimento: string | null;
    cpf: string | null;
    telefone: string | null;
    email: string | null;
  };
  analise?: {
    id: string;
    diagnostico_principal: string; // Backend usa diagnostico_principal
    cid10: string | null;
    confianca: number; // Backend usa confianca (0-100)
    criada_em: string;
  } | null;
}

export interface TranscriptionHistory {
  id: string;
  consultation_id: string;
  content: string;
  timestamp: string;
  isVoice: boolean;
  type: "user" | "assistant" | "system";
  consulta?: {
    id: string;
    queixa_principal: string;
    paciente?: {
      nome: string;
    };
  };
}

export interface AnalysisHistory {
  id: string;
  consultation_id: string;
  diagnosis: string;
  cid10: string | null;
  confidence: number;
  symptoms: string[];
  suggestedExams: Array<{
    nome: string;
    motivo: string;
    prioridade: "urgente" | "alta" | "media" | "baixa" | "rotina";
  }>;
  suggestedMedications: Array<{
    nome: string;
    dosagem: string;
    via: string;
    frequencia: string;
    duracao: string;
    observacoes?: string;
  }>;
  notes: string | null;
  created_at: string;
  consulta?: {
    id: string;
    queixa_principal: string;
    paciente?: {
      nome: string;
    };
  };
}

export type HistoryFilter = {
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  patientId?: string;
  professionalId?: string;
};

export type HistorySortField = "iniciada_em" | "updated_at"; // Backend suporta estes campos
export type HistorySortOrder = "asc" | "desc";
