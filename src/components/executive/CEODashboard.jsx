import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/supabase";
import { BarChart3, PieChart, Activity, BarChart, LineChart, Layers, Users, Building, Package, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import CEOSidebar from './CEOSidebar';
import CompanyOverview from './dashboard/CompanyOverview';
import FinancialSummary from './dashboard/FinancialSummary';
import OperationsInsights from './dashboard/OperationsInsights';
import StrategicInitiatives from './dashboard/StrategicInitiatives';
import ActivityFeed from './dashboard/ActivityFeed';

const CEODashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState({
    companies: [],
    sales: [],
    inventory: [],
    operations: [],
    personnel: [],
    finance: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalSales: 0,
    activeProjects: 0,
    employeeCount: 0,
    inventoryValue: 0,
    pendingApprovals: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('ceo_dashboard_data')
          .select('*')
          .not('company', 'eq', 'Fresheco Farming Limited')
          .order('created_at', { ascending: false })
          .limit(500);
          
        if (error) throw error;
        
        const companies = [];
        const sales = [];
        const inventory = [];
        const operations = [];
        const personnel = [];
        const finance = [];
        const recentActivity = [];
        
        let totalRevenue = 0;
        let totalSales = 0;
        let activeProjects = 0;
        let employeeCount = 0;
        let inventoryValue = 0;
        let pendingApprovals = 0;
        
        data.forEach(item => {
          if (item.created_at) {
            recentActivity.push({
              id: item.id,
              type: item.data_type,
              company: item.company,
              module: item.module,
              summary: generateSummary(item),
              timestamp: new Date(item.created_at).toLocaleString()
            });
          }
          
          switch(item.data_type) {
            case 'sales':
              sales.push(item);
              if (item.data && item.data.unitPrice && item.data.quantity) {
                totalRevenue += item.data.unitPrice * item.data.quantity;
                totalSales++;
              }
              break;
            case 'inventory':
              inventory.push(item);
              if (item.data && item.data.value) {
                inventoryValue += item.data.value;
              }
              break;
            case 'operations':
              operations.push(item);
              if (item.data && item.data.status === 'active') {
                activeProjects++;
              }
              break;
            case 'personnel':
              personnel.push(item);
              if (item.data && item.data.count) {
                employeeCount += item.data.count;
              }
              break;
            case 'finance':
              finance.push(item);
              break;
            case 'approval':
              if (item.data && item.data.status === 'pending') {
                pendingApprovals++;
              }
              break;
            case 'company':
              const existingCompany = companies.find(c => c.name === item.company);
              if (!existingCompany) {
                companies.push({
                  name: item.company,
                  data: item.data
                });
              }
              break;
            default:
              break;
          }
        });
        
        setDashboardData({
          companies,
          sales,
          inventory,
          operations,
          personnel,
          finance,
          recentActivity
        });
        
        setMetrics({
          totalRevenue,
          totalSales,
          activeProjects,
          employeeCount,
          inventoryValue,
          pendingApprovals
        });
        
      } catch (err) {
        console.error("Error fetching CEO dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    
    const subscription = supabase
      .channel('ceo_dashboard_changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'ceo_dashboard_data',
        filter: 'company!eq.Fresheco Farming Limited'
      }, (payload) => {
        console.log('New dashboard data received:', payload);
        fetchDashboardData();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const generateSummary = (item) => {
    switch(item.data_type) {
      case 'sales':
        return `New sale of ${item.data?.quantity || ''} ${item.data?.product || 'items'} to ${item.data?.customer || 'customer'}`;
      case 'inventory':
        return `Inventory update: ${item.data?.action || 'change'} for ${item.data?.product || 'items'}`;
      case 'operations':
        return `Operations update in ${item.module}`;
      case 'personnel':
        return `Personnel update: ${item.data?.action || ''} ${item.data?.role || 'employee'}`;
      case 'finance':
        return `Financial update: ${item.data?.type || ''} of UGX ${item.data?.amount?.toLocaleString() || ''}`;
      case 'approval':
        return `${item.data?.type || 'Item'} waiting for your approval`;
      default:
        return `Update from ${item.company} - ${item.module}`;
    }
  };

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
                  <h3 className="text-2xl font-bold">UGX {metrics.totalRevenue.toLocaleString()}</h3>
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
                  <h3 className="text-2xl font-bold">{metrics.activeProjects}</h3>
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
                  <h3 className="text-2xl font-bold">{metrics.employeeCount}</h3>
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
                  <h3 className="text-2xl font-bold">UGX {metrics.inventoryValue.toLocaleString()}</h3>
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
                  <h3 className="text-2xl font-bold">{metrics.totalSales}</h3>
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
                  <h3 className="text-2xl font-bold">{metrics.pendingApprovals}</h3>
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
          
          <TabsContent value="overview" className="space-y-4">
            <CompanyOverview 
              companies={dashboardData.companies}
              loading={loading}
            />
          </TabsContent>
          
          <TabsContent value="financial" className="space-y-4">
            <FinancialSummary 
              sales={dashboardData.sales}
              finance={dashboardData.finance}
              loading={loading}
            />
          </TabsContent>
          
          <TabsContent value="operations" className="space-y-4">
            <OperationsInsights 
              operations={dashboardData.operations}
              inventory={dashboardData.inventory}
              personnel={dashboardData.personnel}
              loading={loading}
            />
          </TabsContent>
          
          <TabsContent value="strategic" className="space-y-4">
            <StrategicInitiatives 
              data={dashboardData}
              loading={loading}
            />
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4">
            <ActivityFeed 
              activities={dashboardData.recentActivity}
              loading={loading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CEODashboard;
