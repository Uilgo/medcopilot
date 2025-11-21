/**
 * LoginPage
 * Página de login do sistema
 */

import { LoginForm } from "@/features/auth/components/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { AuthLayout } from "@/layouts/AuthLayout";

export const LoginPage = () => {
  return (
    <AuthLayout>
      <LoginForm />
      <DemoAccessCard />
    </AuthLayout>
  );
};

const DemoAccessCard = () => {
  const { login, isLoggingIn } = useAuth();

  const handleDemoAccess = async () => {
    await login({
      email: "teste@teste.com",
      senha: "Teste@123",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-medical-500 dark:hover:border-medical-400 transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-medical-100 dark:bg-medical-900/30">
              <span className="text-lg">🚀</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Demonstração</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Explore a plataforma completa sem precisar criar uma conta
          </p>
        </div>
        <Button
          onClick={handleDemoAccess}
          disabled={isLoggingIn}
          variant="primary"
          size="md"
          className="w-full sm:w-auto shrink-0"
        >
          {isLoggingIn ? "Entrando..." : "Acessar"}
        </Button>
      </div>
    </div>
  );
};
