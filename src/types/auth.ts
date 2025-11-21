/**
 * Tipos relacionados à autenticação e usuários
 */

export interface User {
  id: string; // UUID do auth.users
  nome: string;
  sobrenome: string | null;
  nome_completo: string | null; // Campo gerado automaticamente
  email: string | null;
  avatar_url: string | null;
  especialidade: string | null;
  crm: string | null;
  ativo: boolean;
  onboarding: boolean;
  created_at: string;
  updated_at: string;
}

// Tipo para criação de usuário (sem campos gerados/defaults)
export interface CreateUserInput {
  id: string; // Deve vir do auth.users
  nome: string;
  sobrenome: string;
  email?: string;
  avatar_url?: string;
  especialidade?: string;
  crm?: string;
}

// Tipo para atualização de usuário
export interface UpdateUserInput {
  nome?: string;
  sobrenome?: string;
  email?: string;
  avatar_url?: string;
  especialidade?: string;
  crm?: string;
  ativo?: boolean;
  onboarding?: boolean;
}

// Workspace simplificado (usado em respostas de auth)
export interface UserWorkspace {
  id: string;
  slug: string;
  nome: string;
  logo_url: string | null;
  role: "ADMIN" | "PROFESSIONAL" | "STAFF";
  status_assinatura: "trial" | "active" | "suspended" | "cancelled";
}

// Dados de entrada para signup
export interface SignupData {
  nome: string;
  sobrenome: string;
  email: string;
  senha: string;
}

// Dados de entrada para login
export interface LoginData {
  email: string;
  senha: string;
}

// Dados de entrada para onboarding
export interface OnboardingData {
  // Dados Profissionais
  especialidade?: string;
  crm?: string;
  avatar_url?: string;

  // Dados da Clínica
  nome_workspace: string;
  slug?: string;
  logo_url?: string;
  descricao?: string;
  telefone_principal?: string;
  telefone_residencial?: string;
  tipo_documento?: "cpf" | "cnpj";
  cpf_cnpj?: string;

  // Endereço
  endereco_cep?: string;
  endereco_estado?: string;
  endereco_cidade?: string;
  endereco_bairro?: string;
  endereco_rua?: string;
  endereco_numero?: string;
  endereco_complemento?: string;
  endereco_referencia?: string;
}
