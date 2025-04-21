
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, PieChart, Activity, BarChart, LineChart, Layers, Users, Building, Package, DollarSign, TrendingUp, Calendar } from "lucide-react";
import CEOSidebar from './CEOSidebar';
import CompanyOverview from './dashboard/CompanyOverview';
import FinancialSummary from './dashboard/FinancialSummary';
import OperationsInsights from './dashboard/OperationsInsights';
import StrategicInitiatives from './dashboard/StrategicInitiatives';
import ActivityFeed from './dashboard/ActivityFeed';
import { useCEODashboardData } from '@/hooks/useCEODashboardData';

const CEODashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { dashboardData, isLoading, metrics = {} } = useCEODashboardData();

  // Add fallback metrics with default values to prevent undefined errors
  const defaultMetrics = {
    totalRevenue: 0,
    totalSales: 0,
    activeProjects: 0,
    employeeCount: 0,
    inventoryValue: 0,
    pendingApprovals: 0
  };

  // Use spread to ensure we have default values if metrics is undefined
  const displayMetrics = { ...defaultMetrics, ...(metrics || {}) };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading dashboard data...</div>;
  }

  return (
    <div className="flex">
      <CEOSidebar activeTab={activeTab} onChangeTab={setActiveTab} />
      
      <div className="flex-1 p-4 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1F2C]">Executive Dashboard</h1>
            <p className="text-[#8E9196]">Welcome back, H.E. Rtd. Maj. Gen. Muheesi Geoffrey Baraba</p>
          </div>
          <Badge className="bg-[#E5DEFF] text-[#6E59A5] hover:bg-[#D6BCFA]">
            CEO Access
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#8E9196] text-sm">Total Revenue</p>
                  <h3 className="text-2xl font-bold">UGX {displayMetrics.totalRevenue.toLocaleString()}</h3>
                </div>
                <div className="p-2 bg-[#F2FCE2] rounded-full">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <Progress value={85} className="h-1 mt-4" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#8E9196] text-sm">Active Projects</p>
                  <h3 className="text-2xl font-bold">{displayMetrics.activeProjects}</h3>
                </div>
                <div className="p-2 bg-[#E5DEFF] rounded-full">
                  <Activity className="h-5 w-5 text-[#6E59A5]" />
                </div>
              </div>
              <Progress value={65} className="h-1 mt-4" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#8E9196] text-sm">Personnel</p>
                  <h3 className="text-2xl font-bold">{displayMetrics.employeeCount}</h3>
                </div>
                <div className="p-2 bg-[#FFDEE2] rounded-full">
                  <Users className="h-5 w-5 text-red-500" />
                </div>
              </div>
              <Progress value={78} className="h-1 mt-4" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#8E9196] text-sm">Inventory Value</p>
                  <h3 className="text-2xl font-bold">UGX {displayMetrics.inventoryValue.toLocaleString()}</h3>
                </div>
                <div className="p-2 bg-[#D3E4FD] rounded-full">
                  <Package className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <Progress value={42} className="h-1 mt-4" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#8E9196] text-sm">Total Sales</p>
                  <h3 className="text-2xl font-bold">{displayMetrics.totalSales}</h3>
                </div>
                <div className="p-2 bg-[#FDE1D3] rounded-full">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                </div>
              </div>
              <Progress value={92} className="h-1 mt-4" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#8E9196] text-sm">Pending Approvals</p>
                  <h3 className="text-2xl font-bold">{displayMetrics.pendingApprovals}</h3>
                </div>
                <div className="p-2 bg-[#FEF7CD] rounded-full">
                  <Calendar className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <Progress value={25} className="h-1 mt-4" />
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 h-12">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              <span>Financial</span>
            </TabsTrigger>
            <TabsTrigger value="operations" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span>Operations</span>
            </TabsTrigger>
            <TabsTrigger value="strategic" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>Strategic</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>Activity</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <CompanyOverview 
              companies={dashboardData.companies || []}
              loading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="financial">
            <FinancialSummary 
              sales={dashboardData.sales || []}
              finance={dashboardData.finance || []}
              loading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="operations">
            <OperationsInsights 
              operations={dashboardData.operations || []}
              inventory={dashboardData.inventory || []}
              personnel={dashboardData.personnel || []}
              loading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="strategic">
            <StrategicInitiatives 
              data={dashboardData}
              loading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="activity">
            <ActivityFeed 
              activities={dashboardData.recentActivity || []}
              loading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CEODashboard;
