/**
 * Tipos relacionados a consultas, transcrições, análises e chat
 */

import type { MessageType } from "./common";

// ============================================
// CONSULTATION
// ============================================

export interface Consultation {
  id: string;
  workspace_id: string;
  paciente_id: string;
  profissional_id: string;
  queixa_principal: string | null;
  iniciada_em: string;
  concluida_em: string | null;
  duracao_minutos: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateConsultationInput {
  workspace_id: string;
  paciente_id: string;
  profissional_id: string;
  queixa_principal?: string;
}

export interface UpdateConsultationInput {
  queixa_principal?: string;
  concluida_em?: string;
  duracao_minutos?: number;
}

// ============================================
// TRANSCRIPTION
// ============================================

export interface Transcription {
  id: string;
  consulta_id: string;
  texto_completo: string;
  audio_url: string | null;
  duracao_audio_segundos: number | null;
  idioma: string;
  confianca_score: number | null;
  falantes: Record<string, unknown> | null; // JSONB
  created_at: string;
}

export interface CreateTranscriptionInput {
  consulta_id: string;
  texto_completo: string;
  audio_url?: string;
  duracao_audio_segundos?: number;
  idioma?: string;
  confianca_score?: number;
  falantes?: Record<string, unknown>;
}

// ============================================
// ANALYSIS RESULT
// ============================================

export interface AnalysisResult {
  id: string;
  consulta_id: string;
  diagnostico: string | null;
  exames_sugeridos: Record<string, unknown> | null; // JSONB
  medicamentos_sugeridos: Record<string, unknown> | null; // JSONB
  notas_clinicas: string | null;
  nivel_confianca: string | null;
  modelo_ia: string | null;
  tempo_processamento_ms: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateAnalysisResultInput {
  consulta_id: string;
  diagnostico?: string;
  exames_sugeridos?: Record<string, unknown>;
  medicamentos_sugeridos?: Record<string, unknown>;
  notas_clinicas?: string;
  nivel_confianca?: string;
  modelo_ia?: string;
  tempo_processamento_ms?: number;
}

export interface UpdateAnalysisResultInput {
  diagnostico?: string;
  exames_sugeridos?: Record<string, unknown>;
  medicamentos_sugeridos?: Record<string, unknown>;
  notas_clinicas?: string;
  nivel_confianca?: string;
}

// ============================================
// CHAT MESSAGE
// ============================================

export interface ChatMessage {
  id: string;
  consulta_id: string;
  user_id: string;
  tipo_mensagem: MessageType;
  conteudo: string;
  audio_url: string | null;
  resposta_ia: boolean;
  metadata: Record<string, unknown> | null; // JSONB
  created_at: string;
}

export interface CreateChatMessageInput {
  consulta_id: string;
  user_id: string;
  tipo_mensagem: MessageType;
  conteudo: string;
  audio_url?: string;
  resposta_ia?: boolean;
  metadata?: Record<string, unknown>;
}
