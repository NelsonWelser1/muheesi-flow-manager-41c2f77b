
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContractsManager from './contracts/ContractsManager';
import { ChevronRight, Box, Truck, UserCheck, DollarSign, FileText } from 'lucide-react';
import ComplianceButton from './compliance/ComplianceButton';

const EquatorExportDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Equator Coffee Export</h2>
          <p className="text-sm text-muted-foreground">Manage your global coffee export operations</p>
        </div>
        <div className="flex items-center gap-2">
          <ComplianceButton />
        </div>
      </div>
      
      <Tabs defaultValue="contracts">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="contracts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Contracts</span>
          </TabsTrigger>
          <TabsTrigger value="shipments" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span>Shipments</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Box className="h-4 w-4" />
            <span>Inventory</span>
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            <span>Customers</span>
          </TabsTrigger>
          <TabsTrigger value="finance" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>Finance</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="contracts" className="pt-6">
          <ContractsManager />
        </TabsContent>
        
        <TabsContent value="shipments" className="pt-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Shipments Management</h3>
            <p className="text-muted-foreground">This feature is coming soon.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="inventory" className="pt-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Inventory Management</h3>
            <p className="text-muted-foreground">This feature is coming soon.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="customers" className="pt-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Customer Management</h3>
            <p className="text-muted-foreground">This feature is coming soon.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="finance" className="pt-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Financial Management</h3>
            <p className="text-muted-foreground">This feature is coming soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EquatorExportDashboard;
