
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import CattleRegistration from './CattleRegistration';
import CattleHealth from './CattleHealth';
import CattleGrowth from './CattleGrowth';
import CattleList from './CattleList';
import KyalimaCattleFattening from './KyalimaCattleFattening';

const LivestockManagement = () => {
  const [activeTab, setActiveTab] = useState('cattle');

  // Custom wrapper for KyalimaCattleFattening component
  const CustomCattleFattening = () => {
    return (
      <div className="cattle-fattening-wrapper">
        <div className="mb-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h3 className="text-lg font-semibold text-amber-800 mb-2">Enhanced Fattening Program</h3>
          <p className="text-amber-700 mb-2">
            Track your cattle's growth progress, health records and fattening performance metrics.
          </p>
          <div className="flex flex-wrap gap-2 my-2">
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Weight Tracking</Badge>
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Feed Conversion</Badge>
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Performance Metrics</Badge>
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Health Monitoring</Badge>
          </div>
        </div>
        <KyalimaCattleFattening />
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Livestock Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="cattle">Cattle List</TabsTrigger>
            <TabsTrigger value="registration">Registration</TabsTrigger>
            <TabsTrigger value="health">Health Records</TabsTrigger>
            <TabsTrigger value="growth">Growth Tracking</TabsTrigger>
            <TabsTrigger value="fattening">Fattening Programs</TabsTrigger>
          </TabsList>
          <TabsContent value="cattle">
            <CattleList />
          </TabsContent>
          <TabsContent value="registration">
            <CattleRegistration />
          </TabsContent>
          <TabsContent value="health">
            <CattleHealth />
          </TabsContent>
          <TabsContent value="growth">
            <CattleGrowth />
          </TabsContent>
          <TabsContent value="fattening">
            <CustomCattleFattening />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LivestockManagement;
