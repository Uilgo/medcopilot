/**
 * Verificar se CRM está disponível
 * Usa Supabase RPC diretamente para resposta instantânea
 */

import { supabase } from "@/lib/supabase";

export const checkCrmAvailability = async (crm: string): Promise<boolean> => {
  if (!crm || crm.length < 5) {
    return true; // Não validar se não tiver tamanho mínimo
  }

  try {
    const { data, error } = await supabase.rpc("check_crm_availability", { crm_to_check: crm });

    if (error) {
      console.error("Erro ao verificar CRM:", error);
      return true; // Em caso de erro, permitir continuar
    }

    // A função RPC retorna TRUE se está disponível, FALSE se já existe
    return data === true;
  } catch (error) {
    console.error("Erro ao verificar CRM:", error);
    return true; // Em caso de erro, permitir continuar
  }
};
