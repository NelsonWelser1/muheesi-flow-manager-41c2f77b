
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StockOperations from './StockOperations';
import ViewCurrentStock from '../ViewCurrentStock';
import MakeReports from '../MakeReports';
import ManageFarms from '../ManageFarms';
import ManageAssociations from '../ManageAssociations';
import MakeRequisitions from '../MakeRequisitions';

const KazoCoffeeProject = () => {
  return (
    <Tabs defaultValue="update-stock" className="w-full">
      <TabsList className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="update-stock">Update Stock</TabsTrigger>
        <TabsTrigger value="view-stock">View Stock</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="farms">Farms</TabsTrigger>
        <TabsTrigger value="associations">Associations</TabsTrigger>
        <TabsTrigger value="requisitions">Requisitions</TabsTrigger>
      </TabsList>

      <TabsContent value="update-stock">
        <StockOperations isKazo={true} />
      </TabsContent>

      <TabsContent value="view-stock">
        <ViewCurrentStock isKazo={true} />
      </TabsContent>

      <TabsContent value="reports">
        <MakeReports isKazo={true} />
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
  );
};

export default KazoCoffeeProject;
