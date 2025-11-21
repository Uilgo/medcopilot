/**
 * Tipos relacionados a pacientes
 */

export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export interface Patient {
  id: string;
  workspace_id: string;
  nome: string;
  data_nascimento: string; // ISO date string (YYYY-MM-DD)
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

// Tipo para criação de paciente
export interface CreatePatientInput {
  nome: string;
  data_nascimento: string; // YYYY-MM-DD
  telefone?: string;
  tipo_sanguineo?: BloodType;
  historico_medico?: string;
  email?: string;
  endereco?: string;
  cpf?: string;
  observacoes?: string;
}

// Tipo para atualização de paciente
export interface UpdatePatientInput {
  nome?: string;
  data_nascimento?: string;
  telefone?: string;
  tipo_sanguineo?: BloodType;
  historico_medico?: string;
  email?: string;
  endereco?: string;
  cpf?: string;
  observacoes?: string;
}
