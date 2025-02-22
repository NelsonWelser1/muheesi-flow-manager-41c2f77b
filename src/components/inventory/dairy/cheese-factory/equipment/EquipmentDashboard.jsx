
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider } from "@/components/ui/sidebar";
import EquipmentOverview from './overview/EquipmentOverview';
import EquipmentList from './list/EquipmentList';
import MaintenanceHub from './maintenance/MaintenanceHub';
import EquipmentSettings from './settings/EquipmentSettings';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

const EquipmentDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <div className="flex-1 space-y-6 p-4 md:p-6">
          {/* Global Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search equipment, maintenance tasks..."
              className="pl-8"
            />
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="equipment">Equipment List</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <EquipmentOverview />
            </TabsContent>

            <TabsContent value="equipment">
              <EquipmentList />
            </TabsContent>

            <TabsContent value="maintenance">
              <MaintenanceHub />
            </TabsContent>

            <TabsContent value="settings">
              <EquipmentSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default EquipmentDashboard;
