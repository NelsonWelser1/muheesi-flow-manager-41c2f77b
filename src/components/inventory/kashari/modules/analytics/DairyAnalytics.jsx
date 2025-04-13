import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { LineChart, PieChart, BarChart3, ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, Receipt, Beef } from "lucide-react";

const DairyAnalytics = ({ initialTab = "production" }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 h-14 rounded-lg bg-muted/30 p-1">
          <TabsTrigger 
            value="production" 
            className="flex items-center gap-2 h-12 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
          >
            <BarChart3 className="h-5 w-5 text-green-500" />
            <span className="font-medium">Production Summary</span>
          </TabsTrigger>
          <TabsTrigger 
            value="financial" 
            className="flex items-center gap-2 h-12 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
          >
            <PieChart className="h-5 w-5 text-indigo-500" />
            <span className="font-medium">Financial Reports</span>
          </TabsTrigger>
          <TabsTrigger 
            value="trends" 
            className="flex items-center gap-2 h-12 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
          >
            <TrendingUp className="h-5 w-5 text-amber-500" />
            <span className="font-medium">Historical Trends</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="production" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card className="p-4 border-l-4 border-green-500 hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total Milk Production</p>
                  <h3 className="text-2xl font-bold">452 L</h3>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" /> 12% from previous week
                  </p>
                </div>
                <LineChart className="h-10 w-10 text-green-500 opacity-80" />
              </div>
            </Card>
            
            <Card className="p-4 border-l-4 border-blue-500 hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Yield Per Cow</p>
                  <h3 className="text-2xl font-bold">18.4 L</h3>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" /> 5% from previous week
                  </p>
                </div>
                <BarChart3 className="h-10 w-10 text-blue-500 opacity-80" />
              </div>
            </Card>
            
            <Card className="p-4 border-l-4 border-amber-500 hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Active Milking Cows</p>
                  <h3 className="text-2xl font-bold">24</h3>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <ArrowDownRight className="h-3 w-3 mr-1" /> 2 less than last month
                  </p>
                </div>
                <Beef className="h-10 w-10 text-amber-500 opacity-80" />
              </div>
            </Card>
          </div>
          
          <Card className="p-6 hover:shadow-md transition-all duration-200">
            <h3 className="text-lg font-medium mb-4">Weekly Production Trend</h3>
            <div className="h-72 flex items-center justify-center bg-muted/20 rounded-lg">
              <p className="text-muted-foreground">Production trend chart will appear here</p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card className="p-4 border-l-4 border-indigo-500 hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue (Monthly)</p>
                  <h3 className="text-2xl font-bold">$12,450</h3>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" /> 8% from previous month
                  </p>
                </div>
                <DollarSign className="h-10 w-10 text-indigo-500 opacity-80" />
              </div>
            </Card>
            
            <Card className="p-4 border-l-4 border-purple-500 hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Expenses (Monthly)</p>
                  <h3 className="text-2xl font-bold">$7,320</h3>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" /> 4% from previous month
                  </p>
                </div>
                <Receipt className="h-10 w-10 text-purple-500 opacity-80" />
              </div>
            </Card>
            
            <Card className="p-4 border-l-4 border-green-500 hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Profit Margin</p>
                  <h3 className="text-2xl font-bold">41.2%</h3>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" /> 2.5% from previous month
                  </p>
                </div>
                <PieChart className="h-10 w-10 text-green-500 opacity-80" />
              </div>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-6 hover:shadow-md transition-all duration-200">
              <h3 className="text-lg font-medium mb-4">Revenue Breakdown</h3>
              <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                <p className="text-muted-foreground">Revenue breakdown chart will appear here</p>
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-md transition-all duration-200">
              <h3 className="text-lg font-medium mb-4">Expense Allocation</h3>
              <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                <p className="text-muted-foreground">Expense allocation chart will appear here</p>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-4 pt-4">
          <Card className="p-6 hover:shadow-md transition-all duration-200">
            <h3 className="text-lg font-medium mb-4">Annual Production Comparison</h3>
            <div className="h-80 flex items-center justify-center bg-muted/20 rounded-lg">
              <p className="text-muted-foreground">Annual comparison chart will appear here</p>
            </div>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-6 hover:shadow-md transition-all duration-200">
              <h3 className="text-lg font-medium mb-4">Seasonal Production Patterns</h3>
              <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                <p className="text-muted-foreground">Seasonal patterns chart will appear here</p>
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-md transition-all duration-200">
              <h3 className="text-lg font-medium mb-4">Efficiency Metrics Over Time</h3>
              <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                <p className="text-muted-foreground">Efficiency metrics chart will appear here</p>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DairyAnalytics;
