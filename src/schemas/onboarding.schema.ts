/**
 * Schemas de validação Zod para onboarding
 */

import { z } from "zod";
import { isValidCRM, isValidCPF, isValidCNPJ, isValidCEP, isValidPhone } from "@/utils/validators";

// Schema de onboarding completo
export const onboardingSchema = z.object({
  // Dados Profissionais (Step 1)
  especialidade: z.string().min(2, "Especialidade deve ter no mínimo 2 caracteres"),
  crm: z
    .string()
    .refine((val) => !val || isValidCRM(val), "CRM inválido (formato: 12345-UF)")
    .optional(),
  avatar_url: z.string().optional(),

  cpf_cnpj: z
    .string()
    .min(1, "CPF/CNPJ é obrigatório")
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, "");
        // Validar CPF ou CNPJ baseado no tamanho
        if (digits.length <= 11) {
          return isValidCPF(val);
        } else {
          return isValidCNPJ(val);
        }
      },
      { message: "CPF/CNPJ inválido" }
    ),

  // Dados do Workspace (Step 2)
  nome: z.string().min(2, "Nome da clínica deve ter no mínimo 2 caracteres"),
  slug: z
    .string()
    .min(2, "Slug deve ter no mínimo 2 caracteres")
    .regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens"),
  logo_url: z.string().optional(),
  descricao: z.string().optional(),
  telefone_principal: z.string().refine(isValidPhone, "Telefone inválido"),
  telefone_residencial: z
    .string()
    .refine((val) => !val || isValidPhone(val), "Telefone inválido")
    .optional(),

  // Dados de Endereço (Step 3)
  endereco_cep: z.string().refine(isValidCEP, "CEP inválido"),
  endereco_estado: z.string().min(2, "Estado é obrigatório"),
  endereco_cidade: z.string().min(2, "Cidade é obrigatória"),
  endereco_bairro: z.string().min(2, "Bairro é obrigatório"),
  endereco_rua: z.string().min(2, "Rua é obrigatória"),
  endereco_numero: z.string().min(1, "Número é obrigatório"),
  endereco_complemento: z.string().optional(),
  endereco_referencia: z.string().optional(),
});

// Tipo inferido do schema
export type OnboardingInput = z.infer<typeof onboardingSchema>;
