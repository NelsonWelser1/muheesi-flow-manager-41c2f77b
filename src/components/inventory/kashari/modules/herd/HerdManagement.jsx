
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import CattleList from './CattleList';
import CattleRegistrationForm from './CattleRegistrationForm';
import HealthRecordsForm from './HealthRecordsForm';

const HerdManagement = ({ initialTab = 'inventory' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Herd Management</h2>
      
      <Card>
        <Tabs 
          defaultValue={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inventory">Cattle Inventory</TabsTrigger>
            <TabsTrigger value="registration">New Registration</TabsTrigger>
            <TabsTrigger value="health">Health Records</TabsTrigger>
          </TabsList>
          
          <TabsContent value="inventory" className="p-4">
            <CattleList />
          </TabsContent>
          
          <TabsContent value="registration" className="p-4">
            <CattleRegistrationForm />
          </TabsContent>
          
          <TabsContent value="health" className="p-4">
            <HealthRecordsForm />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default HerdManagement;
