/**
 * ForgotPasswordForm Component
 * Formulário de recuperação de senha
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/schemas/auth.schema";

export const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    console.log("Forgot password data:", data);
    // TODO: Implementar lógica de recuperação de senha
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Esqueceu sua senha?</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Digite seu email para receber instruções de recuperação
        </p>
      </div>

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

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          leftIcon={isSubmitting ? Loader2 : undefined}
          className="w-full"
        >
          {isSubmitting ? "Enviando..." : "Enviar instruções"}
        </Button>
      </form>

      {/* Back to Login Link */}
      <div className="text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-medical-600 hover:text-medical-700 dark:text-medical-400 dark:hover:text-medical-300 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para login
        </Link>
      </div>
    </div>
  );
};
