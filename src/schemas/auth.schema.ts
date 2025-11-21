/**
 * Schemas de validação Zod para autenticação
 */

import { z } from "zod";
import { isValidEmail, isValidCRM } from "@/utils/validators";

// Validação de email
export const emailSchema = z
  .string()
  .min(1, "Email é obrigatório")
  .refine(isValidEmail, "Email inválido");

// Validação de senha
export const passwordSchema = z
  .string()
  .min(8, "Senha deve ter no mínimo 8 caracteres")
  .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
  .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
  .regex(/[0-9]/, "Senha deve conter pelo menos um número")
  .regex(/[^A-Za-z0-9]/, "Senha deve conter pelo menos um caractere especial");

// Schema de login
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Schema de cadastro de usuário
export const signUpSchema = z
  .object({
    nome: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
    sobrenome: z.string().min(2, "Sobrenome deve ter no mínimo 2 caracteres"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    especialidade: z.string().optional(),
    crm: z
      .string()
      .refine((val) => !val || isValidCRM(val), "CRM inválido (formato: 12345-UF)")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

// Schema de perfil de usuário
export const userProfileSchema = z.object({
  nome: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  sobrenome: z.string().min(2, "Sobrenome deve ter no mínimo 2 caracteres"),
  email: emailSchema.optional(),
  especialidade: z.string().optional(),
  crm: z
    .string()
    .refine((val) => !val || isValidCRM(val), "CRM inválido (formato: 12345-UF)")
    .optional(),
});

// Schema de recuperação de senha
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Schema de redefinição de senha
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

// Tipos inferidos dos schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
