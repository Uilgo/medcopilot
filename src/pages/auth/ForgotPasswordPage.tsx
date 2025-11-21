/**
 * ForgotPasswordPage
 * Página de recuperação de senha
 */

import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import { AuthLayout } from "@/layouts/AuthLayout";

export const ForgotPasswordPage = () => {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
};
