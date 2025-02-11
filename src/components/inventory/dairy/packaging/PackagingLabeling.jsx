
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package2, Tags } from "lucide-react";
import PackagingForm from './PackagingForm';
import LabelingForm from './LabelingForm';

const PackagingLabeling = () => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Packaging & Labeling Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="packaging" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 gap-4 h-auto p-4 bg-muted/20">
            <TabsTrigger 
              value="packaging" 
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-secondary flex flex-col items-center justify-center gap-2 h-24 relative overflow-hidden"
            >
              <Package2 className="h-6 w-6" />
              <span className="font-semibold">Packaging</span>
              <span className="text-xs text-muted-foreground">Manage product packaging details</span>
            </TabsTrigger>
            <TabsTrigger 
              value="labeling" 
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-secondary flex flex-col items-center justify-center gap-2 h-24 relative overflow-hidden"
            >
              <Tags className="h-6 w-6" />
              <span className="font-semibold">Labeling</span>
              <span className="text-xs text-muted-foreground">Configure product labels</span>
            </TabsTrigger>
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
