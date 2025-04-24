
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import StaffMembers from '../shared/modules/StaffMembers';

const BukomeroDairyDashboard = () => {
  return (
    <div className="space-y-6 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <Info className="h-4 w-4" />
        <AlertDescription>
          This is a data entry terminal for Bukomero Dairy Farm. All information entered here will be shared with Kyalima Farmers Limited Executive Management for strategic decision-making.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="staff" className="w-full">
        <TabsList className="flex flex-wrap gap-1 bg-green-50 p-1 overflow-x-auto">
          <TabsTrigger value="staff">Staff Management</TabsTrigger>
          <TabsTrigger value="cattle">Cattle Records</TabsTrigger>
          <TabsTrigger value="milk">Milk Production</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="mt-4">
          <StaffMembers farmId="bukomero" />
        </TabsContent>

        <TabsContent value="cattle">
          <Card>
            <CardHeader>
              <CardTitle>Cattle Records Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Cattle management interface will be implemented based on executive requirements.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milk">
          <Card>
            <CardHeader>
              <CardTitle>Milk Production Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Milk production tracking interface will be implemented based on executive requirements.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Expenses Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Expense tracking interface will be implemented based on executive requirements.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Inventory tracking interface will be implemented based on executive requirements.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BukomeroDairyDashboard;
