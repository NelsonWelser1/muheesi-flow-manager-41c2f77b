
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MilkPreparationForm from './forms/MilkPreparationForm';
import PasteurizationForm from './forms/PasteurizationForm';
import CultureAdditionForm from './forms/CultureAdditionForm';
import FermentationForm from './forms/FermentationForm';
import CoolingSettingForm from './forms/CoolingSettingForm';
import YogurtPackagingForm from './forms/YogurtPackagingForm';
import InventoryManagementForm from './forms/InventoryManagementForm';
import QualityTestingForm from './forms/QualityTestingForm';
import CleaningSanitationForm from './forms/CleaningSanitationForm';
import YogurtDashboard from './dashboard/YogurtDashboard';

const YogurtProcessing = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Yogurt Processing Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="preparation">Preparation</TabsTrigger>
            <TabsTrigger value="pasteurization">Pasteurization</TabsTrigger>
            <TabsTrigger value="culture">Culture</TabsTrigger>
            <TabsTrigger value="fermentation">Fermentation</TabsTrigger>
            <TabsTrigger value="cooling">Cooling</TabsTrigger>
            <TabsTrigger value="packaging">Packaging</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="cleaning">Cleaning</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <YogurtDashboard />
          </TabsContent>

          <TabsContent value="preparation">
            <MilkPreparationForm />
          </TabsContent>

          <TabsContent value="pasteurization">
            <PasteurizationForm />
          </TabsContent>

          <TabsContent value="culture">
            <CultureAdditionForm />
          </TabsContent>

          <TabsContent value="fermentation">
            <FermentationForm />
          </TabsContent>

          <TabsContent value="cooling">
            <CoolingSettingForm />
          </TabsContent>

          <TabsContent value="packaging">
            <YogurtPackagingForm />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryManagementForm />
          </TabsContent>

          <TabsContent value="quality">
            <QualityTestingForm />
          </TabsContent>

          <TabsContent value="cleaning">
            <CleaningSanitationForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default YogurtProcessing;

