/**
 * Configuração do React Query
 * Gerencia cache, refetch e estado de queries
 * Com persistência em localStorage para evitar FOUC
 */

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tempo que os dados ficam "frescos" antes de serem considerados stale
      staleTime: 1000 * 60 * 5, // 5 minutos

      // Tempo que os dados ficam em cache antes de serem removidos
      gcTime: 1000 * 60 * 60 * 24, // 24 horas (para persistir no localStorage)

      // Refetch automático quando a janela ganha foco
      refetchOnWindowFocus: false,

      // Refetch automático quando reconecta à internet
      refetchOnReconnect: true,

      // Refetch quando monta o componente apenas se dados estiverem stale
      refetchOnMount: true,

      // Número de tentativas em caso de erro
      retry: 1,

      // Delay entre tentativas (exponencial)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Retry para mutations (geralmente não queremos retry em mutations)
      retry: false,
    },
  },
});
