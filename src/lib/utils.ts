/**
 * Utility Functions
 * Funções auxiliares para a aplicação
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes CSS condicionalmente e resolve conflitos do Tailwind
 * Usa clsx para combinar classes e tailwind-merge para resolver conflitos
 *
 * @example
 * cn('px-2 py-1', condition && 'bg-red-500', 'text-white')
 * cn('px-2', { 'bg-blue-500': isActive })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata uma data no formato YYYY-MM-DD para DD/MM/YYYY
 * Evita problemas de timezone ao trabalhar diretamente com a string
 *
 * @param dateString - Data no formato YYYY-MM-DD
 * @returns Data formatada em DD/MM/YYYY ou string vazia se inválida
 *
 * @example
 * formatDate('1997-12-14') // '14/12/1997'
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";

  // Divide a string no formato YYYY-MM-DD
  const [year, month, day] = dateString.split("-");

  // Valida se temos todos os componentes
  if (!year || !month || !day) return "";

  // Retorna no formato DD/MM/YYYY
  return `${day}/${month}/${year}`;
}
