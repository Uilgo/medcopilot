/**
 * Sidebar Component
 * Sidebar do painel admin inspirado no shadcn/ui sidebar-07
 */

import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Mic,
  FileText,
  Users,
  UserCog,
  Settings,
  Building2,
  ChevronsUpDown,
  User,
  LogOut,
  Check,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "dashboard",
  },
  {
    label: "Nova Consulta",
    icon: Mic,
    path: "nova-consulta",
    badge: "IA",
    highlight: true,
  },
  {
    label: "Histórico",
    icon: FileText,
    path: "historico",
  },
  {
    label: "Pacientes",
    icon: Users,
    path: "pacientes",
  },
  {
    label: "Equipe",
    icon: UserCog,
    path: "equipe",
  },
  {
    label: "Configurações",
    icon: Settings,
    path: "configuracoes",
  },
];

export const Sidebar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  const { isCollapsed } = useSidebar();
  const user = useAuthStore((state) => state.user);
  const workspaces = useAuthStore((state) => state.workspaces);
  const { logout } = useAuth();

  // Define o workspace ativo (primeiro workspace ou o selecionado)
  const activeWorkspace = workspaces?.find((w) => w.id === activeWorkspaceId) || workspaces?.[0];

  // Separa o workspace ativo dos outros
  const otherWorkspaces = workspaces?.filter((w) => w.id !== activeWorkspace?.id);

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out overflow-hidden",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header com Workspace Dropdown */}
      <div
        className={cn(
          "flex h-20 items-center border-b border-gray-200 dark:border-gray-700 relative",
          isCollapsed ? "p-2" : "p-3"
        )}
      >
        {!isCollapsed ? (
          <div className="w-full animate-in fade-in duration-200 delay-150">
            <button
              onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              {activeWorkspace?.logo_url ? (
                <img
                  src={activeWorkspace.logo_url}
                  alt={activeWorkspace.nome}
                  className="h-10 w-10 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-medical-100 dark:bg-medical-900/20 shrink-0">
                  <Building2 className="h-6 w-6 text-medical-600 dark:text-medical-400" />
                </div>
              )}
              <div className="flex flex-1 flex-col items-start min-w-0">
                <span className="text-sm font-semibold text-gray-900 dark:text-white truncate w-full text-left">
                  {activeWorkspace?.nome || "MedCopilot"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 text-left">
                  Workspace
                </span>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-gray-500 dark:text-gray-400 shrink-0" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="mx-auto p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            title={activeWorkspace?.nome || "MedCopilot"}
          >
            {activeWorkspace?.logo_url ? (
              <img
                src={activeWorkspace.logo_url}
                alt={activeWorkspace.nome}
                className="h-10 w-10 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-medical-100 dark:bg-medical-900/20">
                <Building2 className="h-6 w-6 text-medical-600 dark:text-medical-400" />
              </div>
            )}
          </button>
        )}

        {/* Workspace Dropdown Menu */}
        {showWorkspaceMenu && (
          <>
            {/* Overlay */}
            <div className="fixed inset-0 z-10" onClick={() => setShowWorkspaceMenu(false)} />

            {/* Menu */}
            <div
              className={cn(
                "z-50 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden",
                isCollapsed
                  ? "fixed top-3 left-24 w-64"
                  : "absolute top-full left-0 right-0 mt-2 mx-2"
              )}
            >
              {/* Workspace Atual */}
              <div className="p-2">
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Workspace Atual
                </div>
                <button
                  className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm bg-medical-50 dark:bg-medical-900/20 text-medical-700 dark:text-medical-400 cursor-default"
                  onClick={() => setShowWorkspaceMenu(false)}
                >
                  {activeWorkspace?.logo_url ? (
                    <img
                      src={activeWorkspace.logo_url}
                      alt={activeWorkspace.nome}
                      className="h-6 w-6 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-medical-100 dark:bg-medical-900/30">
                      <Building2 className="h-4 w-4" />
                    </div>
                  )}
                  <span className="font-medium truncate flex-1 text-left">
                    {activeWorkspace?.nome}
                  </span>
                  <Check className="h-4 w-4 shrink-0" />
                </button>
              </div>

              {/* Outros Workspaces */}
              {otherWorkspaces && otherWorkspaces.length > 0 && (
                <>
                  <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                  <div className="p-2">
                    <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Outros Workspaces
                    </div>
                    <div className="space-y-1">
                      {otherWorkspaces.map((workspace) => (
                        <button
                          key={workspace.id}
                          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                          onClick={() => {
                            setActiveWorkspaceId(workspace.id);
                            setShowWorkspaceMenu(false);
                          }}
                        >
                          {workspace.logo_url ? (
                            <img
                              src={workspace.logo_url}
                              alt={workspace.nome}
                              className="h-6 w-6 rounded object-cover"
                            />
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 dark:bg-gray-700">
                              <Building2 className="h-4 w-4" />
                            </div>
                          )}
                          <span className="truncate flex-1 text-left">{workspace.nome}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4">
        <nav className="px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-all",
                        "text-gray-700 dark:text-gray-300",
                        "hover:bg-gray-100 dark:hover:bg-gray-700",
                        isActive &&
                          "bg-medical-50 dark:bg-medical-900/20 text-medical-700 dark:text-medical-400",
                        isCollapsed && "justify-center"
                      )
                    }
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!isCollapsed && (
                      <span className="animate-in fade-in duration-200 delay-150">
                        {item.label}
                      </span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* User Menu */}
      <div
        className={cn("border-t border-gray-200 dark:border-gray-700", isCollapsed ? "p-2" : "p-3")}
      >
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer",
              isCollapsed ? "justify-center p-2" : "px-3 py-3"
            )}
            title={isCollapsed ? user?.nome : undefined}
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.nome}
                className="h-9 w-9 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-medical-100 dark:bg-medical-900/20 shrink-0">
                <User className="h-5 w-5 text-medical-600 dark:text-medical-400" />
              </div>
            )}
            {!isCollapsed && (
              <div className="flex flex-1 items-center gap-3 animate-in fade-in duration-200 delay-150">
                <div className="flex flex-1 flex-col items-start min-w-0">
                  <span className="text-sm font-medium text-gray-900 dark:text-white text-left w-full">
                    {user?.nome}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 text-left truncate w-full">
                    {user?.email}
                  </span>
                </div>
                <ChevronsUpDown className="h-4 w-4 text-gray-500 dark:text-gray-400 shrink-0" />
              </div>
            )}
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <>
              {/* Overlay */}
              <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />

              {/* Menu */}
              <div
                className={cn(
                  "z-50 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1 shadow-lg",
                  isCollapsed
                    ? "fixed bottom-0 left-24 w-48 translate-y-[-0.5rem]"
                    : "absolute bottom-full left-0 right-0 mb-2"
                )}
              >
                <button
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    setShowUserMenu(false);
                    // Navigate to profile
                  }}
                >
                  <User className="h-4 w-4" />
                  Perfil
                </button>
                <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
                <button
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-critical-600 dark:text-critical-400 hover:bg-critical-50 dark:hover:bg-critical-900/20 cursor-pointer"
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};
