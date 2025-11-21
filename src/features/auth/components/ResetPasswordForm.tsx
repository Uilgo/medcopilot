/**
 * ResetPasswordForm Component
 * Formulário de redefinição de senha
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { resetPasswordSchema, type ResetPasswordInput } from "@/schemas/auth.schema";

export const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    console.log("Reset password data:", data);
    // TODO: Implementar lógica de redefinição de senha
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Redefinir senha</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Digite sua nova senha</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Password */}
        <Input
          label="Nova senha"
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

        {/* Confirm Password */}
        <Input
          label="Confirmar nova senha"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Digite a senha novamente"
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

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          leftIcon={isSubmitting ? Loader2 : undefined}
          className="w-full"
        >
          {isSubmitting ? "Redefinindo..." : "Redefinir senha"}
        </Button>
      </form>
    </div>
  );
};
