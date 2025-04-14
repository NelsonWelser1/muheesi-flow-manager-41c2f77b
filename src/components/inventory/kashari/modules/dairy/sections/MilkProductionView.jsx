
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MilkProductionView = () => {
  const [activeTab, setActiveTab] = useState('daily');

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Milk Production</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="daily">Daily Records</TabsTrigger>
          <TabsTrigger value="processing">Milk Processing</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <div className="p-4 bg-gray-50 rounded-lg">
            Daily milk production records will be displayed here
          </div>
        </TabsContent>
        
        <TabsContent value="processing">
          <div className="p-4 bg-gray-50 rounded-lg">
            Milk processing information will be displayed here
          </div>
        </TabsContent>
        
        <TabsContent value="quality">
          <div className="p-4 bg-gray-50 rounded-lg">
            Quality control metrics will be displayed here
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MilkProductionView;
