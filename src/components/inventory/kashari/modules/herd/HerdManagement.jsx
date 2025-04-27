
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CattleInventoryTable from './CattleInventoryTable';
import { useCattleHealthRecords } from '@/hooks/useCattleHealthRecords';
import { HealthRecordsView } from '../cattle/health';

const HerdManagement = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Herd Management</h2>
      
      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger 
            value="inventory" 
            className="flex items-center gap-2 h-12 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
          >
            Cattle Inventory
          </TabsTrigger>
          <TabsTrigger 
            value="health" 
            className="flex items-center gap-2 h-12 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
          >
            Health Records
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Cattle Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <CattleInventoryTable />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="health">
          <Card>
            <CardContent className="pt-6">
              <HealthRecordsView />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HerdManagement;
