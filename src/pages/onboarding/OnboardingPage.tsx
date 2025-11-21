/**
 * OnboardingPage
 * Página de onboarding para novos usuários
 */

import { OnboardingForm } from "@/features/onboarding/components/OnboardingForm";
import { AuthLayout } from "@/layouts/AuthLayout";

export const OnboardingPage = () => {
  return (
    <AuthLayout>
      <OnboardingForm />
    </AuthLayout>
  );
};
