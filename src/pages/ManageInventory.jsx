import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UpdateStock from '../components/inventory/UpdateStock';
import ViewCurrentStock from '../components/inventory/ViewCurrentStock';
import MakeReports from '../components/inventory/MakeReports';
import ManageFarms from '../components/inventory/ManageFarms';
import ManageAssociations from '../components/inventory/ManageAssociations';
import MakeRequisitions from '../components/inventory/MakeRequisitions';

const ManageInventory = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Inventory</h1>
      <Tabs defaultValue="update-stock">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="update-stock">Update Stock</TabsTrigger>
          <TabsTrigger value="view-stock">View Current Stock</TabsTrigger>
          <TabsTrigger value="reports">Make Reports</TabsTrigger>
          <TabsTrigger value="farms">Manage Farms</TabsTrigger>
          <TabsTrigger value="associations">Manage Associations</TabsTrigger>
          <TabsTrigger value="requisitions">Make Requisitions</TabsTrigger>
        </TabsList>
        <TabsContent value="update-stock">
          <UpdateStock />
        </TabsContent>
        <TabsContent value="view-stock">
          <ViewCurrentStock />
        </TabsContent>
        <TabsContent value="reports">
          <MakeReports />
        </TabsContent>
        <TabsContent value="farms">
          <ManageFarms />
        </TabsContent>
        <TabsContent value="associations">
          <ManageAssociations />
        </TabsContent>
        <TabsContent value="requisitions">
          <MakeRequisitions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageInventory;