import api from "@/lib/axios";
import type { DashboardStats } from "../types/dashboard.types";

export const dashboardService = {
  getStats: async (workspaceSlug: string): Promise<DashboardStats> => {
    const response = await api.get(`/${workspaceSlug}/dashboard/stats`);
    return response.data.data;
  },
};
