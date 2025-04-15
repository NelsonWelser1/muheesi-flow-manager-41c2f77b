
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, TrendingUp, DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AnalyticsView = ({ activeTab = 'production' }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <BarChart2 className="mr-2 h-6 w-6 text-green-500" />
          Analytics Dashboard
        </h2>
      </div>
      
      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="production">Production Summary</TabsTrigger>
          <TabsTrigger value="financial">Financial Reports</TabsTrigger>
          <TabsTrigger value="trends">Historical Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="production" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                Production Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <p className="text-muted-foreground">Production efficiency charts will be displayed here...</p>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Milk Production Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-60">
                <p className="text-muted-foreground">Production distribution chart here...</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Producing Cattle</CardTitle>
              </CardHeader>
              <CardContent className="h-60">
                <p className="text-muted-foreground">Top producers table here...</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-green-500" />
                Financial Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <p className="text-muted-foreground">Financial charts will be displayed here...</p>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <h3 className="text-lg font-medium text-green-600">Revenue</h3>
              <p className="text-3xl font-bold">$24,850</p>
              <p className="text-sm text-green-500">+8% from last month</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
              <h3 className="text-lg font-medium text-red-600">Expenses</h3>
              <p className="text-3xl font-bold">$14,275</p>
              <p className="text-sm text-red-500">+3% from last month</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="text-lg font-medium text-blue-600">Profit</h3>
              <p className="text-3xl font-bold">$10,575</p>
              <p className="text-sm text-green-500">+12% from last month</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Long-term Production Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <p className="text-muted-foreground">Long-term trends chart will be displayed here...</p>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Seasonal Performance</CardTitle>
              </CardHeader>
              <CardContent className="h-60">
                <p className="text-muted-foreground">Seasonal performance chart here...</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Year-over-Year Comparison</CardTitle>
              </CardHeader>
              <CardContent className="h-60">
                <p className="text-muted-foreground">YoY comparison chart here...</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsView;
