
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import DairyManagement from './modules/DairyManagement';
import LivestockManagement from './modules/LivestockManagement';
import BananaPlantation from './modules/BananaPlantation';
import EmployeeManagement from './modules/EmployeeManagement';
import ScholarshipProgram from './modules/ScholarshipProgram';
import FinanceAccounts from './modules/FinanceAccounts';

const KashariFarmDashboard = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/manage-inventory');
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          onClick={handleBackClick} 
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Inventory
        </Button>
      </div>
      <Card className="relative">
        <CardHeader className="mx-[2px] my-[2px]">
          <CardTitle>Kashari Mixed Farm Management System</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dairy" className="space-y-4">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="dairy">Dairy Products</TabsTrigger>
              <TabsTrigger value="livestock">Livestock</TabsTrigger>
              <TabsTrigger value="banana">Banana Plantation</TabsTrigger>
              <TabsTrigger value="employees">Employee Management</TabsTrigger>
              <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
              <TabsTrigger value="finance">Finance & Accounts</TabsTrigger>
            </TabsList>

            <TabsContent value="dairy">
              <DairyManagement />
            </TabsContent>

            <TabsContent value="livestock">
              <LivestockManagement />
            </TabsContent>

            <TabsContent value="banana">
              <BananaPlantation />
            </TabsContent>

            <TabsContent value="employees">
              <EmployeeManagement />
            </TabsContent>

            <TabsContent value="scholarships">
              <ScholarshipProgram />
            </TabsContent>

            <TabsContent value="finance">
              <FinanceAccounts />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default KashariFarmDashboard;
