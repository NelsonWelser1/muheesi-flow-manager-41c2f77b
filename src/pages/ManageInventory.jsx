import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UpdateStock from '../components/inventory/UpdateStock';
import ViewCurrentStock from '../components/inventory/ViewCurrentStock';
import MakeReports from '../components/inventory/MakeReports';
import ManageFarms from '../components/inventory/ManageFarms';
import ManageAssociations from '../components/inventory/ManageAssociations';
import MakeRequisitions from '../components/inventory/MakeRequisitions';
import { Card, CardContent } from "@/components/ui/card";

const ManageInventory = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Inventory</h1>
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="update-stock" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 gap-4">
              <TabsTrigger value="update-stock">Update Stock</TabsTrigger>
              <TabsTrigger value="view-stock">View Current Stock</TabsTrigger>
              <TabsTrigger value="reports">Make Reports</TabsTrigger>
              <TabsTrigger value="farms">Manage Farms</TabsTrigger>
              <TabsTrigger value="associations">Manage Associations</TabsTrigger>
              <TabsTrigger value="requisitions">Make Requisitions</TabsTrigger>
            </TabsList>

            <TabsContent value="update-stock" className="mt-6">
              <UpdateStock />
            </TabsContent>
            <TabsContent value="view-stock" className="mt-6">
              <ViewCurrentStock />
            </TabsContent>
            <TabsContent value="reports" className="mt-6">
              <MakeReports />
            </TabsContent>
            <TabsContent value="farms" className="mt-6">
              <ManageFarms />
            </TabsContent>
            <TabsContent value="associations" className="mt-6">
              <ManageAssociations />
            </TabsContent>
            <TabsContent value="requisitions" className="mt-6">
              <MakeRequisitions />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageInventory;