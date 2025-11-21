/**
 * Layout para páginas de autenticação
 * Usado em: Login, Signup, Forgot Password, Reset Password, Onboarding
 */

import { ModeToggle } from "@/components/ModeToggle";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="h-svh overflow-hidden bg-linear-to-br from-teal-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header com logo e toggle de tema */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-r from-teal-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">MedCopilot</span>
          </div>

          {/* Toggle de tema */}
          <ModeToggle />
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="h-full flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[480px] flex flex-col max-h-[calc(100svh-6rem)]">
          {/* Card do formulário */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          <footer className="mt-3 text-center text-xs text-gray-600 dark:text-gray-400 shrink-0">
            <p>© 2025 MedCopilot. Transformando consultas médicas com IA.</p>
          </footer>
        </div>
      </main>
    </div>
  );
};
