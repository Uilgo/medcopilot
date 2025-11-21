/**
 * Tipos relacionados a workspaces e membros
 */

import type { SubscriptionStatus, SubscriptionPlan, WorkspaceRole, DocumentType } from "./common";

export interface Workspace {
  id: string;
  slug: string;
  nome: string;
  owner_id: string;
  status_assinatura: SubscriptionStatus;
  plano_assinatura: SubscriptionPlan;
  descricao: string | null;
  logo_url: string | null;

  // Contato
  telefone_principal: string | null;
  telefone_residencial: string | null;

  // Documento
  tipo_documento: DocumentType | null;
  cpf_cnpj: string | null;

  // Endereço
  endereco_cep: string | null;
  endereco_estado: string | null;
  endereco_cidade: string | null;
  endereco_bairro: string | null;
  endereco_rua: string | null;
  endereco_numero: string | null;
  endereco_complemento: string | null;
  endereco_referencia: string | null;

  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  convidado_por: string | null;
  data_entrada: string;
  ativo: boolean;
}

// Tipo para criação de workspace
export interface CreateWorkspaceInput {
  slug: string;
  nome: string;
  owner_id: string;
  descricao?: string;
  logo_url?: string;
  telefone_principal?: string;
  tipo_documento?: DocumentType;
  cpf_cnpj?: string;
}

// Tipo para atualização de workspace
export interface UpdateWorkspaceInput {
  nome?: string;
  slug?: string;
  descricao?: string;
  logo_url?: string;
  telefone_principal?: string;
  telefone_residencial?: string;
  tipo_documento?: DocumentType;
  cpf_cnpj?: string;
  endereco_cep?: string;
  endereco_estado?: string;
  endereco_cidade?: string;
  endereco_bairro?: string;
  endereco_rua?: string;
  endereco_numero?: string;
  endereco_complemento?: string;
  endereco_referencia?: string;
  status_assinatura?: SubscriptionStatus;
  plano_assinatura?: SubscriptionPlan;
}

// Tipo para adicionar membro ao workspace
export interface AddWorkspaceMemberInput {
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  convidado_por?: string;
}
