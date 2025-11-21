/**
 * Schemas de validação Zod comuns
 * Validações reutilizáveis em toda aplicação
 */

import { z } from "zod";
import { isValidCPF, isValidCNPJ, isValidCEP, isValidPhone } from "@/utils/validators";

// Validação de telefone celular brasileiro (com 9 dígitos)
export const phoneSchema = z
  .string()
  .regex(/^\(?[1-9]{2}\)?\s?9\d{4}-?\d{4}$/, "Formato de telefone inválido")
  .refine(isValidPhone, "Telefone inválido")
  .optional()
  .or(z.literal(""));

// Validação de telefone residencial brasileiro (8 dígitos)
export const residentialPhoneSchema = z
  .string()
  .regex(/^\(?[1-9]{2}\)?\s?\d{4}-?\d{4}$/, "Formato de telefone inválido")
  .refine(isValidPhone, "Telefone inválido")
  .optional()
  .or(z.literal(""));

// Validação de CPF com verificação de dígitos
export const cpfSchema = z
  .string()
  .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "Formato de CPF inválido")
  .refine(isValidCPF, "CPF inválido")
  .optional()
  .or(z.literal(""));

// Validação de CNPJ com verificação de dígitos
export const cnpjSchema = z
  .string()
  .regex(/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/, "Formato de CNPJ inválido")
  .refine(isValidCNPJ, "CNPJ inválido")
  .optional()
  .or(z.literal(""));

// Validação de CEP
export const cepSchema = z
  .string()
  .regex(/^\d{5}-?\d{3}$/, "Formato de CEP inválido")
  .refine(isValidCEP, "CEP inválido")
  .optional()
  .or(z.literal(""));
