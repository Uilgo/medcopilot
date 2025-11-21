/**
 * Schemas de validação Zod para workspaces
 */

import { z } from "zod";
import { phoneSchema, cepSchema } from "./common.schema";

// Schema de workspace
export const workspaceSchema = z.object({
  nome: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  slug: z.string().min(3, "Slug deve ter no mínimo 3 caracteres"),
  descricao: z.string().optional(),
  telefone_principal: phoneSchema,
  tipo_documento: z.enum(["cpf", "cnpj"]).optional(),
  cpf_cnpj: z.string().optional(),
  endereco_cep: cepSchema,
  endereco_estado: z.string().max(2).optional(),
  endereco_cidade: z.string().optional(),
  endereco_bairro: z.string().optional(),
  endereco_rua: z.string().optional(),
  endereco_numero: z.string().optional(),
  endereco_complemento: z.string().optional(),
});

// Tipos inferidos
export type WorkspaceInput = z.infer<typeof workspaceSchema>;
