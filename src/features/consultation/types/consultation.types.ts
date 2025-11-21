/**
 * Types para feature de Consulta
 */

export type RecordingState = "idle" | "recording" | "processing" | "completed";

export type MessageType = "user" | "assistant" | "system";

export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export interface Patient {
  id: string;
  workspace_id: string;
  nome: string;
  data_nascimento: string;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  tipo_sanguineo: BloodType | null;
  historico_medico: string | null;
  cpf: string | null;
  observacoes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  isVoice?: boolean;
  editedAt?: string;
  editCount?: number;
}

export interface AIAnalysis {
  symptoms: string[];
  diagnosis: string;
  cid10?: string;
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
  confidence: number;
  notes?: string;
}

export interface PatientFormData {
  // OBRIGATÓRIOS
  nome: string;
  data_nascimento: string; // DD/MM/YYYY no frontend

  // OPCIONAIS DESEJÁVEIS
  telefone?: string;
  tipo_sanguineo?: BloodType;
  historico_medico?: string;

  // OPCIONAIS
  email?: string;
  endereco?: string;
  cpf?: string;
  observacoes?: string;
}
