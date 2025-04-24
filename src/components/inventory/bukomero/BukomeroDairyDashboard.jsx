
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBukomeroDairyData } from '@/hooks/useBukomeroDairyData';

// Placeholder components until the actual dashboard components are implemented
const PlaceholderComponent = ({ title }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            This section is under development. Data entry interface coming soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The data entry interface for this section is being prepared. When complete, 
            authorized personnel will be able to input and manage {title.toLowerCase()} data here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const Overview = () => {
  const { farmMetrics, isLoading, error } = useBukomeroDairyData();
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Farm Overview</CardTitle>
          <CardDescription>Key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading farm data...</p>
          ) : error ? (
            <p className="text-red-500">Error loading farm data</p>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Cattle:</span>
                <span className="font-medium">{farmMetrics?.totalCattle || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Milk Production:</span>
                <span className="font-medium">{farmMetrics?.milkProduction || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Fattening:</span>
                <span className="font-medium">{farmMetrics?.activeFattening || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Last Updated:</span>
                <span>{farmMetrics?.lastUpdated 
                  ? new Date(farmMetrics.lastUpdated).toLocaleString() 
                  : 'Never'}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const MilkProduction = () => <PlaceholderComponent title="Milk Production" />;
const CattleManagement = () => <PlaceholderComponent title="Cattle Management" />;
const FinancialRecords = () => <PlaceholderComponent title="Financial Records" />;
const ReportsAnalytics = () => <PlaceholderComponent title="Reports & Analytics" />;

const BukomeroDairyDashboard = () => {
  return (
    <div className="space-y-6 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4 text-sm">
        <p className="font-medium text-yellow-800">
          Data Entry Terminal: All information entered here will be shared with Kyalima Farmers Limited Executive Management for strategic decision-making.
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="flex flex-wrap gap-1 bg-green-50 p-1 overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="milkProduction">Milk Production</TabsTrigger>
          <TabsTrigger value="cattleManagement">Cattle Management</TabsTrigger>
          <TabsTrigger value="financialRecords">Financial Records</TabsTrigger>
          <TabsTrigger value="reportsAnalytics">Reports & Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Overview />
        </TabsContent>

        <TabsContent value="milkProduction">
          <MilkProduction />
        </TabsContent>

        <TabsContent value="cattleManagement">
          <CattleManagement />
        </TabsContent>

        <TabsContent value="financialRecords">
          <FinancialRecords />
        </TabsContent>

        <TabsContent value="reportsAnalytics">
          <ReportsAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BukomeroDairyDashboard;
