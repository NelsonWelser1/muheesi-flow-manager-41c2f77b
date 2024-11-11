import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StoreManagement from './StoreManagement';
import FarmManagement from './FarmManagement';
import ViewCurrentStock from '../ViewCurrentStock';
import MakeReports from '../MakeReports';
import ManageAssociations from '../ManageAssociations';
import MakeRequisitions from '../MakeRequisitions';

const KazoCoffeeProject = () => {
  return (
    <Tabs defaultValue="update-stock" className="w-full">
      <TabsList className="w-full justify-start overflow-x-auto flex-nowrap md:flex-wrap">
        <TabsTrigger value="update-stock" className="whitespace-nowrap">Update Stock</TabsTrigger>
        <TabsTrigger value="view-stock" className="whitespace-nowrap">View Stock</TabsTrigger>
        <TabsTrigger value="reports" className="whitespace-nowrap">Reports</TabsTrigger>
        <TabsTrigger value="farms" className="whitespace-nowrap">Farms</TabsTrigger>
        <TabsTrigger value="associations" className="whitespace-nowrap">Associations</TabsTrigger>
        <TabsTrigger value="requisitions" className="whitespace-nowrap">Requisitions</TabsTrigger>
      </TabsList>

      <TabsContent value="update-stock">
        <StoreManagement />
      </TabsContent>

      <TabsContent value="view-stock">
        <ViewCurrentStock />
      </TabsContent>

      <TabsContent value="reports">
        <MakeReports />
      </TabsContent>

      <TabsContent value="farms">
        <FarmManagement />
      </TabsContent>

      <TabsContent value="associations">
        <ManageAssociations />
      </TabsContent>

      <TabsContent value="requisitions">
        <MakeRequisitions />
      </TabsContent>
    </Tabs>
  );
};

export default KazoCoffeeProject;