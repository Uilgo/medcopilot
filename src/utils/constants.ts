/**
 * Constantes da aplicação
 */

// Roles de workspace
export const WORKSPACE_ROLES = {
  ADMIN: "ADMIN",
  PROFESSIONAL: "PROFESSIONAL",
  STAFF: "STAFF",
} as const;

export const WORKSPACE_ROLE_LABELS = {
  ADMIN: "Administrador",
  PROFESSIONAL: "Profissional",
  STAFF: "Equipe",
} as const;

// Status de assinatura
export const SUBSCRIPTION_STATUS = {
  TRIAL: "trial",
  ACTIVE: "active",
  SUSPENDED: "suspended",
  CANCELLED: "cancelled",
} as const;

export const SUBSCRIPTION_STATUS_LABELS = {
  trial: "Período de Teste",
  active: "Ativo",
  suspended: "Suspenso",
  cancelled: "Cancelado",
} as const;

// Planos de assinatura
export const SUBSCRIPTION_PLANS = {
  BASIC: "basic",
  PROFESSIONAL: "professional",
  ENTERPRISE: "enterprise",
} as const;

export const SUBSCRIPTION_PLAN_LABELS = {
  basic: "Básico",
  professional: "Profissional",
  enterprise: "Empresarial",
} as const;

// Tipos de mensagem
export const MESSAGE_TYPES = {
  TEXTO: "texto",
  AUDIO: "audio",
  SISTEMA: "sistema",
} as const;

export const MESSAGE_TYPE_LABELS = {
  texto: "Texto",
  audio: "Áudio",
  sistema: "Sistema",
} as const;

// Estados brasileiros
export const BRAZILIAN_STATES = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
] as const;
