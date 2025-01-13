import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QualityTestForm from './QualityTestForm';
import QualityTrends from './QualityTrends';
import QualityChecklist from './QualityChecklist';
import { useToast } from "@/components/ui/use-toast";

const QualityControlPanel = () => {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cheese Quality Control Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="test-entry" className="space-y-4">
            <TabsList>
              <TabsTrigger value="test-entry">Record Quality Test</TabsTrigger>
              <TabsTrigger value="trends">Quality Trends</TabsTrigger>
              <TabsTrigger value="checklist">Quality Checklist</TabsTrigger>
            </TabsList>

            <TabsContent value="test-entry">
              <QualityTestForm />
            </TabsContent>

            <TabsContent value="trends">
              <QualityTrends />
            </TabsContent>

            <TabsContent value="checklist">
              <QualityChecklist />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityControlPanel;