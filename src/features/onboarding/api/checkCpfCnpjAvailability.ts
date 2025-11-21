/**
 * Verificar se CPF/CNPJ está disponível
 * Usa Supabase RPC diretamente para resposta instantânea
 */

import { supabase } from "@/lib/supabase";

export const checkCpfCnpjAvailability = async (cpfCnpj: string): Promise<boolean> => {
  if (!cpfCnpj || cpfCnpj.replace(/\D/g, "").length < 11) {
    return true; // Não validar se não tiver tamanho mínimo
  }

  try {
    const { data, error } = await supabase.rpc("check_cpf_cnpj_availability", {
      cpf_cnpj_to_check: cpfCnpj,
    });

    if (error) {
      console.error("Erro ao verificar CPF/CNPJ:", error);
      return true; // Em caso de erro, permitir continuar
    }

    // A função RPC retorna TRUE se está disponível, FALSE se já existe
    return data === true;
  } catch (error) {
    console.error("Erro ao verificar CPF/CNPJ:", error);
    return true; // Em caso de erro, permitir continuar
  }
};
