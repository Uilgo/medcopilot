/**
 * Schemas de validação Zod para pacientes
 */

import { z } from "zod";
import { cpfSchema, phoneSchema } from "./common.schema";
import { emailSchema } from "./auth.schema";

// Tipos sanguíneos válidos
export const bloodTypeSchema = z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]);

// Schema de paciente para criação
export const patientSchema = z.object({
  // OBRIGATÓRIOS
  nome: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(200, "Nome deve ter no máximo 200 caracteres"),
  data_nascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),

  // OPCIONAIS DESEJÁVEIS
  telefone: phoneSchema.optional(),
  tipo_sanguineo: bloodTypeSchema.optional(),
  historico_medico: z
    .string()
    .max(2000, "Histórico médico deve ter no máximo 2000 caracteres")
    .optional(),

  // OPCIONAIS
  email: emailSchema.optional(),
  endereco: z.string().max(500, "Endereço deve ter no máximo 500 caracteres").optional(),
  cpf: cpfSchema.optional(),
  observacoes: z.string().max(1000, "Observações devem ter no máximo 1000 caracteres").optional(),
});

// Tipos inferidos
export type PatientInput = z.infer<typeof patientSchema>;
export type BloodType = z.infer<typeof bloodTypeSchema>;
