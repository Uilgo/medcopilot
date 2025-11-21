/**
 * SignupForm Component
 * Formulário de cadastro com validação
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Mail, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { signUpSchema, type SignUpInput } from "@/schemas/auth.schema";
import { useAuth } from "@/hooks/useAuth";

export const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup, isSigningUp, signupError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpInput) => {
    signup({
      nome: data.nome,
      sobrenome: data.sobrenome,
      email: data.email,
      senha: data.password,
    });
  };

  // Mostrar erro de signup
  useEffect(() => {
    if (signupError) {
      const error = signupError as Error & {
        response?: { data?: { message?: string; error?: string } };
      };
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Erro ao criar conta";

      toast.error(errorMessage);
    }
  }, [signupError]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Criar sua conta</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Preencha os dados para começar
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Nome e Sobrenome */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nome"
            type="text"
            placeholder="Seu nome"
            leftIcon={User}
            autoComplete="given-name"
            error={errors.nome?.message}
            {...register("nome")}
          />
          <Input
            label="Sobrenome"
            type="text"
            placeholder="Seu sobrenome"
            leftIcon={User}
            autoComplete="family-name"
            error={errors.sobrenome?.message}
            {...register("sobrenome")}
          />
        </div>

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

        {/* Senha e Confirmar Senha */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Senha"
            type={showPassword ? "text" : "password"}
            placeholder="Mínimo 8 caracteres"
            leftIcon={Lock}
            autoComplete="new-password"
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
          <Input
            label="Confirmar senha"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirme a senha"
            leftIcon={Lock}
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            }
            {...register("confirmPassword")}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSigningUp}
          leftIcon={isSigningUp ? Loader2 : undefined}
          className="w-full"
        >
          {isSigningUp ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Já tem uma conta?{" "}
          <Link
            to="/login"
            className="font-medium text-medical-600 hover:text-medical-700 dark:text-medical-400 dark:hover:text-medical-300 cursor-pointer"
          >
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
};
