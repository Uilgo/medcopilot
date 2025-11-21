/**
 * Configuração de rotas da aplicação
 */

import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { RootRedirect } from "./RootRedirect";
import { DefaultLayout } from "@/layouts/DefaultLayout";
import { LoginPage } from "@/pages/auth/LoginPage";
import { SignupPage } from "@/pages/auth/SignupPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage";
import { OnboardingPage } from "@/pages/onboarding/OnboardingPage";
import { DashboardPage } from "@/pages/admin/DashboardPage";
import { NovaConsultaPage } from "@/pages/admin/NovaConsultaPage";
import { HistoricoPage } from "@/pages/admin/HistoricoPage";
import { PacientesPage } from "@/pages/admin/PacientesPage";
import { EquipePage } from "@/pages/admin/EquipePage";
import { ConfiguracoesPage } from "@/pages/admin/ConfiguracoesPage";

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/onboarding",
    element: (
      <ProtectedRoute>
        <OnboardingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/:workspace_slug",
    element: (
      <ProtectedRoute>
        <DefaultLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "nova-consulta",
        element: <NovaConsultaPage />,
      },
      {
        path: "historico",
        element: <HistoricoPage />,
      },
      {
        path: "pacientes",
        element: <PacientesPage />,
      },
      {
        path: "equipe",
        element: <EquipePage />,
      },
      {
        path: "configuracoes",
        element: <ConfiguracoesPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
