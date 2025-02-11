
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PackagingForm from './PackagingForm';
import LabelingForm from './LabelingForm';

const PackagingLabeling = () => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Packaging & Labeling Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="packaging" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="packaging">Packaging</TabsTrigger>
            <TabsTrigger value="labeling">Labeling</TabsTrigger>
          </TabsList>
          <TabsContent value="packaging">
            <PackagingForm />
          </TabsContent>
          <TabsContent value="labeling">
            <LabelingForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PackagingLabeling;
