/**
 * LoginForm Component
 * Formulário de login com validação
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginInput } from "@/schemas/auth.schema";
import type { LoginData } from "@/types/auth";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn, loginError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    const loginData: LoginData = {
      email: data.email,
      senha: data.password,
    };
    await login(loginData);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bem-vindo de volta</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Acesse sua conta para continuar
        </p>
      </div>

      {/* Error Alert */}
      {loginError && (
        <div className="bg-critical-50 dark:bg-critical-900/20 border border-critical-200 dark:border-critical-800 rounded-lg p-4">
          <p className="text-sm text-critical-600 dark:text-critical-400">
            {loginError.message || "Erro ao fazer login. Verifique suas credenciais."}
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <Input
          label="Email"
          type="email"
          placeholder="seu@email.com"
          leftIcon={Mail}
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Password */}
        <Input
          label="Senha"
          type={showPassword ? "text" : "password"}
          placeholder="Sua senha"
          leftIcon={Lock}
          autoComplete="current-password"
          error={errors.password?.message}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          }
          {...register("password")}
        />

        {/* Forgot Password Link */}
        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-medical-600 hover:text-medical-700 dark:text-medical-400 dark:hover:text-medical-300 cursor-pointer"
          >
            Esqueceu sua senha?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLoggingIn}
          leftIcon={isLoggingIn ? Loader2 : undefined}
          className="w-full"
        >
          {isLoggingIn ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      {/* Signup Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Não tem uma conta?{" "}
          <Link
            to="/signup"
            className="font-medium text-medical-600 hover:text-medical-700 dark:text-medical-400 dark:hover:text-medical-300 cursor-pointer"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
};
