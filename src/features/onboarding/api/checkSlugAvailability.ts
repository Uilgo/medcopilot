/**
 * Verifica se um slug está disponível
 * Usa Supabase RPC diretamente para resposta imediata
 */

import { supabase } from "@/lib/supabase";

export const checkSlugAvailability = async (slug: string): Promise<boolean> => {
  if (!slug || slug.length < 2) {
    return false;
  }

  try {
    const { data, error } = await supabase.rpc("check_slug_availability", { slug_to_check: slug });

    if (error) {
      console.error("Erro ao verificar slug:", error);
      return false;
    }

    // A função RPC retorna TRUE se está disponível, FALSE se já existe
    return data === true;
  } catch (error) {
    console.error("Erro ao verificar slug:", error);
    return false;
  }
};
