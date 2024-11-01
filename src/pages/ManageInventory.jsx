import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UpdateStock from '../components/inventory/UpdateStock';
import ViewCurrentStock from '../components/inventory/ViewCurrentStock';
import MakeReports from '../components/inventory/MakeReports';
import ManageFarms from '../components/inventory/ManageFarms';
import ManageAssociations from '../components/inventory/ManageAssociations';
import MakeRequisitions from '../components/inventory/MakeRequisitions';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const companies = [
  {
    name: "Grand Berna Dairies",
    description: "Dairy Products Management",
    component: "grand-berna"
  },
  {
    name: "KAJON Coffee Limited",
    description: "Coffee Products Management",
    component: "kajon-coffee"
  },
  {
    name: "Kyalima Farmers Limited",
    description: "Agricultural Products Management",
    component: "kyalima-farmers"
  }
];

const ManageInventory = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Inventory</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <Card key={company.name} className="w-full">
            <CardHeader>
              <CardTitle>{company.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{company.description}</p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="update-stock" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 gap-1">
                  <TabsTrigger value="update-stock">Update Stock</TabsTrigger>
                  <TabsTrigger value="view-stock">View Stock</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                  <TabsTrigger value="farms">Farms</TabsTrigger>
                  <TabsTrigger value="associations">Associations</TabsTrigger>
                  <TabsTrigger value="requisitions">Requisitions</TabsTrigger>
                </TabsList>

                <TabsContent value="update-stock">
                  <UpdateStock defaultTab={company.component} />
                </TabsContent>
                <TabsContent value="view-stock">
                  <ViewCurrentStock company={company.name} />
                </TabsContent>
                <TabsContent value="reports">
                  <MakeReports company={company.name} />
                </TabsContent>
                <TabsContent value="farms">
                  <ManageFarms company={company.name} />
                </TabsContent>
                <TabsContent value="associations">
                  <ManageAssociations company={company.name} />
                </TabsContent>
                <TabsContent value="requisitions">
                  <MakeRequisitions company={company.name} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManageInventory;