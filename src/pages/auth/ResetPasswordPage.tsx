/**
 * ResetPasswordPage
 * Página de redefinição de senha
 */

import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import { AuthLayout } from "@/layouts/AuthLayout";

export const ResetPasswordPage = () => {
  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  );
};
