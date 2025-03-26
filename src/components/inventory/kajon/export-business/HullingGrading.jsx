
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const HullingGrading = ({ viewOnly = false }) => {
  return (
    <div className="space-y-6">
      {viewOnly && (
        <Alert variant="warning" className="bg-amber-50 border-amber-200 mb-4">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            You are viewing the Hulling & Grading dashboard in read-only mode. Data entry and modifications are only available to operational staff.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="hulling">
        <TabsList>
          <TabsTrigger value="hulling">Hulling Operations</TabsTrigger>
          <TabsTrigger value="grading">Grading & Classification</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
          <TabsTrigger value="equipment">Equipment Status</TabsTrigger>
          <TabsTrigger value="reports">Processing Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hulling">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Hulling Operations</h3>
              <p>
                View and manage coffee bean hulling operations and processing metrics.
                {viewOnly && " This view is read-only for executive review."}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="grading">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Grading & Classification</h3>
              <p>
                Coffee grading and classification metrics and standards.
                {viewOnly && " This view is read-only for executive review."}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="quality">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Quality Control</h3>
              <p>
                Coffee quality monitoring and control procedures.
                {viewOnly && " This view is read-only for executive review."}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="equipment">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Equipment Status</h3>
              <p>
                Processing equipment status, maintenance, and efficiency metrics.
                {viewOnly && " This view is read-only for executive review."}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Processing Reports</h3>
              <p>
                Comprehensive reports on coffee processing operations and performance.
                {viewOnly && " This view is read-only for executive review."}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HullingGrading;
