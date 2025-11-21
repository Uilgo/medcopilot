/**
 * Funções utilitárias de validação
 * Para schemas Zod, veja src/schemas/
 */

/**
 * Valida CPF brasileiro
 * @param cpf - CPF com ou sem formatação
 * @returns true se válido, false caso contrário
 */
export function isValidCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, "");

  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // Validação dos dígitos verificadores
  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;

  return true;
}

/**
 * Valida CNPJ brasileiro
 * @param cnpj - CNPJ com ou sem formatação
 * @returns true se válido, false caso contrário
 */
export function isValidCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  const cleanCNPJ = cnpj.replace(/\D/g, "");

  // Verifica se tem 14 dígitos
  if (cleanCNPJ.length !== 14) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;

  // Validação dos dígitos verificadores
  let length = cleanCNPJ.length - 2;
  let numbers = cleanCNPJ.substring(0, length);
  const digits = cleanCNPJ.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  length = length + 1;
  numbers = cleanCNPJ.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
}

/**
 * Valida CEP brasileiro
 * @param cep - CEP com ou sem formatação
 * @returns true se válido, false caso contrário
 */
export function isValidCEP(cep: string): boolean {
  const cleanCEP = cep.replace(/\D/g, "");
  return cleanCEP.length === 8;
}

/**
 * Valida telefone brasileiro (celular ou fixo)
 * @param phone - Telefone com ou sem formatação
 * @returns true se válido, false caso contrário
 */
export function isValidPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, "");

  // Celular: 11 dígitos (DDD + 9 + 8 dígitos)
  // Fixo: 10 dígitos (DDD + 8 dígitos)
  if (cleanPhone.length !== 10 && cleanPhone.length !== 11) {
    return false;
  }

  // Rejeitar números com todos os dígitos iguais
  if (/^(\d)\1+$/.test(cleanPhone)) {
    return false;
  }

  // Remover validação de números sequenciais - muitos números válidos têm sequências

  // Validar DDD (códigos válidos de 11 a 99)
  const ddd = parseInt(cleanPhone.substring(0, 2));
  if (ddd < 11 || ddd > 99) {
    return false;
  }

  // Para celular (11 dígitos), o terceiro dígito deve ser 9
  if (cleanPhone.length === 11) {
    const thirdDigit = cleanPhone[2];
    if (thirdDigit !== "9") {
      return false;
    }
  }

  return true;
}

/**
 * Valida email
 * @param email - Email para validar
 * @returns true se válido, false caso contrário
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida CRM (Conselho Regional de Medicina)
 * @param crm - CRM no formato "12345-UF"
 * @returns true se válido, false caso contrário
 */
export function isValidCRM(crm: string): boolean {
  if (!crm) return false;

  // Remover espaços em branco
  const cleanCrm = crm.trim();

  // Formato: 4-6 dígitos + hífen + 2 letras maiúsculas
  const crmRegex = /^\d{4,6}-[A-Z]{2}$/;
  const isValid = crmRegex.test(cleanCrm);

  return isValid;
}
