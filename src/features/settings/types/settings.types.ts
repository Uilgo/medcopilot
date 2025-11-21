/**
 * Tipos para Configurações do Workspace
 */

export interface WorkspaceAddress {
  cep: string;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
  complemento?: string;
  referencia?: string;
}

export interface WorkspaceSettings {
  id: string;
  slug: string;
  nome: string;
  descricao?: string;
  logo_url?: string;
  telefone_principal: string;
  telefone_residencial?: string;
  tipo_documento: "cpf" | "cnpj";
  cpf_cnpj: string;
  endereco: WorkspaceAddress;
  created_at: string;
  updated_at: string;
}

export interface UpdateWorkspaceSettingsInput {
  nome?: string;
  descricao?: string;
  telefone_principal?: string;
  telefone_residencial?: string;
  endereco?: Partial<WorkspaceAddress>;
}

export interface WorkspaceSettingsResponse {
  data: WorkspaceSettings;
}
