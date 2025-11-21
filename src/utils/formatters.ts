/**
 * Funções utilitárias para formatação de dados
 */

// Formatar data para exibição (DD/MM/YYYY)
export function formatDate(date: string | Date | null): string {
  if (!date) return "-";

  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR");
}

// Formatar data e hora (DD/MM/YYYY HH:mm)
export function formatDateTime(date: string | Date | null): string {
  if (!date) return "-";

  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Formatar telefone (XX) XXXXX-XXXX
export function formatPhone(phone: string | null): string {
  if (!phone) return "-";

  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }

  return phone;
}

// Formatar CPF (XXX.XXX.XXX-XX)
export function formatCPF(cpf: string | null): string {
  if (!cpf) return "-";

  const cleaned = cpf.replace(/\D/g, "");

  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  }

  return cpf;
}

// Formatar CNPJ (XX.XXX.XXX/XXXX-XX)
export function formatCNPJ(cnpj: string | null): string {
  if (!cnpj) return "-";

  const cleaned = cnpj.replace(/\D/g, "");

  if (cleaned.length === 14) {
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`;
  }

  return cnpj;
}

// Formatar CPF ou CNPJ automaticamente
export function formatDocument(doc: string | null): string {
  if (!doc) return "-";

  const cleaned = doc.replace(/\D/g, "");

  if (cleaned.length === 11) return formatCPF(doc);
  if (cleaned.length === 14) return formatCNPJ(doc);

  return doc;
}

// Formatar CEP (XXXXX-XXX)
export function formatCEP(cep: string | null): string {
  if (!cep) return "-";

  const cleaned = cep.replace(/\D/g, "");

  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  }

  return cep;
}

// Formatar duração em minutos para horas e minutos
export function formatDuration(minutes: number | null): string {
  if (!minutes) return "-";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;

  return `${hours}h ${mins}min`;
}

// Formatar nome completo (primeira letra maiúscula)
export function formatName(name: string | null): string {
  if (!name) return "-";

  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
