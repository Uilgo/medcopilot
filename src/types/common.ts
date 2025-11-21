/**
 * Tipos e enums compartilhados em toda a aplicação
 */

// Status de assinatura do workspace
export type SubscriptionStatus = "trial" | "active" | "suspended" | "cancelled";

// Planos de assinatura
export type SubscriptionPlan = "basic" | "professional" | "enterprise";

// Roles de membros do workspace
export type WorkspaceRole = "ADMIN" | "PROFESSIONAL" | "STAFF";

// Tipo de mensagem no chat
export type MessageType = "texto" | "audio" | "sistema";

// Tipo de documento (CPF ou CNPJ)
export type DocumentType = "cpf" | "cnpj";

// Timestamps padrão do Supabase
export interface Timestamps {
  created_at: string;
  updated_at: string;
}

// Timestamps apenas com created_at
export interface CreatedAt {
  created_at: string;
}
