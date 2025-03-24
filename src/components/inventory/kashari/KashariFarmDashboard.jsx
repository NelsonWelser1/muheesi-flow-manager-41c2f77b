
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DairyManagement from './modules/DairyManagement';
import ProductionManagement from './modules/LivestockManagement';
import BananaPlantation from './modules/BananaPlantation';
import SalesExpenditure from './modules/SalesExpenditure';
import EmployeeManagement from './modules/EmployeeManagement';
import ScholarshipProgram from './modules/ScholarshipProgram';
import FinanceAccounts from './modules/FinanceAccounts';

const KashariFarmDashboard = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Kashari Mixed Farm Management System</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dairy" className="space-y-4">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="dairy">Dairy Products</TabsTrigger>
              <TabsTrigger value="production">Production</TabsTrigger>
              <TabsTrigger value="banana">Banana Plantation</TabsTrigger>
              <TabsTrigger value="sales">Sales & Expenditure</TabsTrigger>
              <TabsTrigger value="employees">Employees & Contractors</TabsTrigger>
              <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
              <TabsTrigger value="finance">Finance & Accounts</TabsTrigger>
            </TabsList>

            <TabsContent value="dairy">
              <DairyManagement />
            </TabsContent>

            <TabsContent value="production">
              <ProductionManagement />
            </TabsContent>

            <TabsContent value="banana">
              <BananaPlantation />
            </TabsContent>

            <TabsContent value="sales">
              <SalesExpenditure />
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
