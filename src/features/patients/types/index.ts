export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export interface Patient {
  id: string;
  workspace_id: string;
  nome: string;
  data_nascimento: string | null; // Formato YYYY-MM-DD vindo da API
  cpf: string | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  observacoes: string | null;

  // Campos Médicos (Novos)
  tipo_sanguineo: BloodType | null;
  historico_medico: string | null;

  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface PatientListResponse {
  data: Patient[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Tipos para Formulários (Zod Infer)
export interface CreatePatientInput {
  nome: string;
  data_nascimento: string;
  cpf?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  observacoes?: string;
  tipo_sanguineo?: BloodType;
  historico_medico?: string;
}

export type UpdatePatientInput = Partial<CreatePatientInput>;
