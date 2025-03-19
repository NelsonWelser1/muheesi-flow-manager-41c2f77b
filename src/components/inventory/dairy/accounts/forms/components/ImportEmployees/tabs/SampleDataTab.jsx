
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";

const SampleDataTab = ({ active, sampleData, fileData, generateSampleData }) => {
  return (
    <TabsContent value="sample" forceMount hidden={!active}>
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-md">
            <Database className="h-10 w-10 text-gray-400 mb-2" />
            <p className="mb-2 text-sm text-gray-500">Generate sample employee data for demonstration</p>
            <Button 
              variant="outline" 
              onClick={generateSampleData}
              disabled={sampleData}
            >
              Generate Sample Data
            </Button>
          </div>
          {sampleData && (
            <div className="mt-4">
              <p className="text-sm text-green-600 font-medium">
                ✓ Sample data generated with {fileData?.length || 0} employee records
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default SampleDataTab;
