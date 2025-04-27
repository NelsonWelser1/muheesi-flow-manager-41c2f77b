
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CattleInventory from '../cattle/inventory/CattleInventory';

const HerdManagement = () => {
  const [activeTab, setActiveTab] = useState("inventory");

  return (
    <div className="space-y-4 pt-4">
      <Card className="p-6">
        <Tabs defaultValue="inventory" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="inventory">Cattle Inventory</TabsTrigger>
          </TabsList>
          
          <TabsContent value="inventory" className="space-y-4">
            <CattleInventory />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default HerdManagement;
