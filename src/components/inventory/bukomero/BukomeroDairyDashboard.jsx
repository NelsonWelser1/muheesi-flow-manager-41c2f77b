import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const BukomeroDairyDashboard = () => {
  return (
    <div className="space-y-6 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Data Entry Terminal Alert */}
      <Alert variant="info" className="bg-blue-50 mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Data Entry Terminal: All information entered here will be shared with Kyalima Farmers Limited Executive Management for strategic decision-making.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="overview">
        <TabsList className="flex flex-wrap gap-1 bg-green-50 p-1 overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cattle">Cattle</TabsTrigger>
          <TabsTrigger value="milk">Milk</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="personnel">Personnel</TabsTrigger>
          <TabsTrigger value="logistics">Logistics</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
        </TabsList>

        {/* Placeholder tab content with data entry forms */}
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Overview Data Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Overview data entry interface loading...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cattle">
          <Card>
            <CardHeader>
              <CardTitle>Cattle Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Cattle data entry interface loading...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milk">
          <Card>
            <CardHeader>
              <CardTitle>Milk Production Data Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Milk production data entry interface loading...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics and Reporting</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Analytics and reporting interface loading...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personnel">
          <Card>
            <CardHeader>
              <CardTitle>Personnel Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Personnel management interface loading...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logistics">
          <Card>
            <CardHeader>
              <CardTitle>Logistics and Supply Chain</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Logistics data entry interface loading...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finance">
          <Card>
            <CardHeader>
              <CardTitle>Financial Records</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Financial data entry interface loading...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BukomeroDairyDashboard;
