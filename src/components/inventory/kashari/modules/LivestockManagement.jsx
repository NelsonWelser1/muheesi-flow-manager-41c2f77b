
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductionForm from './ProductionForm';
import CattleFattening from '../../bukomero/modules/CattleFattening';
import CattleRegistration from './CattleRegistration';
import CattleHealth from './CattleHealth';
import CattleGrowth from './CattleGrowth';

const ProductionManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Production Management</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductionForm />
      </CardContent>
    </Card>
  );
};

// Custom wrapper for CattleFattening component to avoid modifying the protected file
const CustomCattleFattening = () => {
  return (
    <div className="cattle-fattening-wrapper">
      <CattleFattening />
    </div>
  );
};

const LivestockManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Livestock Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="registration" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="registration">Registration</TabsTrigger>
            <TabsTrigger value="health">Health Records</TabsTrigger>
            <TabsTrigger value="growth">Growth Tracking</TabsTrigger>
            <TabsTrigger value="fattening">Fattening Programs</TabsTrigger>
          </TabsList>
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
