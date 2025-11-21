/**
 * EquipePage
 * Página de gestão de equipe (ADMIN only)
 */

import { useEffect } from "react";
import { Users, UserPlus, Shield } from "lucide-react";
import { usePageStore } from "@/store/usePageStore";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { MembersTab } from "@/features/team/components/MembersTab";
import { InvitesTab } from "@/features/team/components/InvitesTab";
import { PermissionsTab } from "@/features/team/components/PermissionsTab";

export const EquipePage = () => {
  const { setPageInfo } = usePageStore();

  useEffect(() => {
    setPageInfo("Equipe", "Gerencie os membros do seu workspace");
  }, [setPageInfo]);

  return (
    <div className="h-full flex flex-col p-6">
      <Tabs defaultValue="members" className="w-full">
        <TabsList>
          <TabsTrigger value="members">
            <Users className="h-4 w-4 mr-2" />
            Membros
          </TabsTrigger>
          <TabsTrigger value="invites">
            <UserPlus className="h-4 w-4 mr-2" />
            Convites
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Shield className="h-4 w-4 mr-2" />
            Permissões
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <MembersTab />
        </TabsContent>

        <TabsContent value="invites">
          <InvitesTab />
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
