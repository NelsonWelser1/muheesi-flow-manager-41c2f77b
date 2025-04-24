
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBukomeroDairyData } from '@/hooks/useBukomeroDairyData';
import ExportButtons from "@/components/ui/data-export/ExportButtons";
import { 
  BarChart, 
  PieChart, 
  FileText, 
  Clock
} from "lucide-react";

const BukomeroDairyDashboard = () => {
  const { farmMetrics, isLoading, error, refreshMetrics } = useBukomeroDairyData();

  // Placeholder component for Overview tab
  const Overview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="overflow-hidden">
        <CardHeader className="bg-green-50 border-b border-green-100 p-4">
          <CardTitle className="text-lg text-green-800 flex justify-between">
            Farm Summary
            <Badge variant="outline" className="bg-green-100 text-green-800">Live</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            {isLoading ? (
              <p className="text-sm text-gray-500">Loading metrics...</p>
            ) : error ? (
              <p className="text-sm text-red-500">Error loading farm data</p>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Total Cattle:</span>
                  <span className="text-sm">{farmMetrics?.totalCattle || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Milk Production:</span>
                  <span className="text-sm">{farmMetrics?.milkProduction || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Fattening Program:</span>
                  <span className="text-sm">{farmMetrics?.activeFattening || 'N/A'} active</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Last updated: {new Date().toLocaleTimeString()}
                  </span>
                  <Button size="sm" variant="ghost" className="p-1 h-auto" onClick={refreshMetrics}>
                    Refresh
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-green-50 border-b border-green-100 p-4">
          <CardTitle className="text-lg text-green-800">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <Button size="sm" className="w-full justify-start bg-green-600 hover:bg-green-700">
              <FileText className="mr-2 h-4 w-4" /> Daily Milk Reports
            </Button>
            <Button size="sm" className="w-full justify-start">
              <BarChart className="mr-2 h-4 w-4" /> View Production Charts
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="bg-green-50 border-b border-green-100 p-4">
          <CardTitle className="text-lg text-green-800 flex justify-between">
            Production Statistics
            <ExportButtons data={[]} filename="farm-stats" showDropdown={false} />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-center items-center h-32">
            <PieChart className="h-24 w-24 text-green-300" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  // Placeholder component for MilkProduction tab
  const MilkProduction = () => (
    <div className="border rounded-md p-6 bg-white">
      <h2 className="text-xl font-bold mb-4">Milk Production Data Entry</h2>
      <p className="text-gray-500 mb-4">This section will contain milk production tracking forms and reports.</p>
    </div>
  );
  
  // Placeholder component for CattleManagement tab
  const CattleManagement = () => (
    <div className="border rounded-md p-6 bg-white">
      <h2 className="text-xl font-bold mb-4">Cattle Management Interface</h2>
      <p className="text-gray-500 mb-4">This section will contain cattle inventory, health records, and breeding information.</p>
    </div>
  );
  
  // Placeholder component for FinancialRecords tab
  const FinancialRecords = () => (
    <div className="border rounded-md p-6 bg-white">
      <h2 className="text-xl font-bold mb-4">Financial Records Interface</h2>
      <p className="text-gray-500 mb-4">This section will contain income, expenses, and financial reports for the dairy farm.</p>
    </div>
  );
  
  // Placeholder component for ReportsAnalytics tab
  const ReportsAnalytics = () => (
    <div className="border rounded-md p-6 bg-white">
      <h2 className="text-xl font-bold mb-4">Reports & Analytics Dashboard</h2>
      <p className="text-gray-500 mb-4">This section will provide comprehensive analytics and reporting tools.</p>
    </div>
  );

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
