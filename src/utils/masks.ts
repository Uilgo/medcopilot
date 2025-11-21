/**
 * Funções de máscara para inputs
 */

/**
 * Máscara para CPF: 000.000.000-00
 * Máscara para CNPJ: 00.000.000/0000-00
 */
export const maskCpfCnpj = (value: string): string => {
  const numbers = value.replace(/\D/g, "");

  if (numbers.length <= 11) {
    // CPF: 000.000.000-00
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    // CNPJ: 00.000.000/0000-00
    return numbers
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  }
};

/**
 * Máscara para CRM: 12345-UF
 */
export const maskCrm = (value: string): string => {
  const cleaned = value.replace(/[^0-9A-Za-z]/g, "");

  // Separa números e letras
  const numbers = cleaned.replace(/[^0-9]/g, "");
  const letters = cleaned.replace(/[^A-Za-z]/g, "").toUpperCase();

  if (letters.length > 0) {
    return `${numbers}-${letters}`.substring(0, 9); // Máximo: 12345-UF
  }

  return numbers.substring(0, 6);
};

/**
 * Máscara para telefone: (00) 00000-0000 ou (00) 0000-0000
 */
export const maskPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, "");

  if (numbers.length <= 10) {
    // Telefone fixo: (00) 0000-0000
    return numbers.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  } else {
    // Celular: (00) 00000-0000
    return numbers.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2");
  }
};

/**
 * Máscara para CEP: 00000-000
 */
export const maskCep = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  return numbers.replace(/(\d{5})(\d{1,3})$/, "$1-$2");
};

/**
 * Máscara para UF (Estado): AA
 */
export const maskUf = (value: string): string => {
  return value
    .replace(/[^A-Za-z]/g, "")
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Máscara para número de endereço: apenas números
 */
export const maskNumber = (value: string): string => {
  return value.replace(/\D/g, "");
};
