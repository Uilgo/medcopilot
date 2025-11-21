/**
 * Page Store
 * Gerencia informações da página atual (título, breadcrumbs, etc)
 * Com persistência para evitar FOUC no header
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface PageState {
  title: string;
  description: string;
  _hasHydrated: boolean;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setPageInfo: (title: string, description: string) => void;
  setHasHydrated: (state: boolean) => void;
}

export const usePageStore = create<PageState>()(
  persist(
    (set) => ({
      title: "Dashboard",
      description: "",
      _hasHydrated: false,
      setTitle: (title: string) => set({ title }),
      setDescription: (description: string) => set({ description }),
      setPageInfo: (title: string, description: string) => set({ title, description }),
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
    }),
    {
      name: "page-info-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        title: state.title,
        description: state.description,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
