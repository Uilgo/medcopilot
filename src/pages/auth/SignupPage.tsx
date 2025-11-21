/**
 * SignupPage
 * Página de cadastro do sistema
 */

import { SignupForm } from "@/features/auth/components/SignupForm";
import { AuthLayout } from "@/layouts/AuthLayout";

export const SignupPage = () => {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
};
