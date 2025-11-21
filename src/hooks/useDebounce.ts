/**
 * Hook de Debounce
 * Atrasa a atualização de um valor até que o usuário pare de digitar
 *
 * @param value - Valor a ser debounced
 * @param delay - Tempo de espera em milissegundos (padrão: 500ms)
 * @returns Valor debounced
 *
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 500);
 *
 * useEffect(() => {
 *   // Buscar apenas quando debouncedSearch mudar
 *   fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 */

import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
