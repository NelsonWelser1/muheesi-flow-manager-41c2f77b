import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CattleInventory from './sections/CattleInventory';
import MilkProduction from './sections/MilkProduction';
import HealthRecords from './sections/HealthRecords';
import FeedingProgram from './sections/FeedingProgram';
import BreedingManagement from './sections/BreedingManagement';
import FinancialReports from './sections/FinancialReports';

const BukomeroDairyDashboard = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-7 gap-1 bg-green-50 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cattle">Cattle</TabsTrigger>
          <TabsTrigger value="milk">Milk</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="feeding">Feeding</TabsTrigger>
          <TabsTrigger value="breeding">Breeding</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Overview content */}
          </div>
        </TabsContent>
        
        <TabsContent value="cattle">
          <CattleInventory />
        </TabsContent>
        
        <TabsContent value="milk">
          <MilkProduction />
        </TabsContent>
        
        <TabsContent value="health">
          <HealthRecords />
        </TabsContent>
        
        <TabsContent value="feeding">
          <FeedingProgram />
        </TabsContent>
        
        <TabsContent value="breeding">
          <BreedingManagement />
        </TabsContent>
        
        <TabsContent value="finance">
          {/* Placeholder for Finance content */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BukomeroDairyDashboard;
