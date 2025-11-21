/**
 * App Component
 * Componente raiz da aplicação
 */

import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { router } from "@/routes";
import { Toaster } from "sonner";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <div className="text-lg">Carregando...</div>
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}

export default App;
