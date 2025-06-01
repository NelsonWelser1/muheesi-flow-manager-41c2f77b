
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  AlertTriangle, 
  BarChart3, 
  Target, 
  Calendar,
  Building,
  Eye,
  FileText,
  Settings
} from 'lucide-react';
import ExecutiveSummary from './ceo-dashboard/ExecutiveSummary';
import FinancialOverview from './ceo-dashboard/FinancialOverview';
import OperationalMetrics from './ceo-dashboard/OperationalMetrics';
import StrategicInitiatives from './ceo-dashboard/StrategicInitiatives';
import RiskManagement from './ceo-dashboard/RiskManagement';
import PerformanceReports from './ceo-dashboard/PerformanceReports';

const CEODashboard = () => {
  const [activeTab, setActiveTab] = useState('executive');
  const [selectedCompany, setSelectedCompany] = useState('all');

  const companies = [
    { id: 'all', name: 'All Companies', status: 'active' },
    { id: 'grand-berna', name: 'Grand Berna Dairies', status: 'active' },
    { id: 'kajon-coffee', name: 'KAJON Coffee Limited', status: 'active' },
    { id: 'kyalima-farmers', name: 'Kyalima Farmers Limited', status: 'active' }
  ];

  const quickMetrics = [
    {
      title: "Total Revenue",
      value: "$2.4M",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Active Employees",
      value: "247",
      change: "+8",
      trend: "up",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Production Efficiency",
      value: "87%",
      change: "+3.2%",
      trend: "up",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Critical Alerts",
      value: "3",
      change: "-2",
      trend: "down",
      icon: AlertTriangle,
      color: "text-red-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">CEO Dashboard</h2>
          <p className="text-muted-foreground">
            Strategic oversight and executive decision support
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <select 
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            {companies.map(company => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Live View
          </Button>
        </div>
      </div>

      {/* Quick Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {quickMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className={`text-sm ${metric.color} flex items-center`}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {metric.change}
                  </p>
                </div>
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="executive" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Executive</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Financial</span>
          </TabsTrigger>
          <TabsTrigger value="operations" className="flex items-center gap-1">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Operations</span>
          </TabsTrigger>
          <TabsTrigger value="strategic" className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Strategic</span>
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Risk</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="executive" className="space-y-4">
          <ExecutiveSummary selectedCompany={selectedCompany} />
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <FinancialOverview selectedCompany={selectedCompany} />
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <OperationalMetrics selectedCompany={selectedCompany} />
        </TabsContent>

        <TabsContent value="strategic" className="space-y-4">
          <StrategicInitiatives selectedCompany={selectedCompany} />
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <RiskManagement selectedCompany={selectedCompany} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <PerformanceReports selectedCompany={selectedCompany} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CEODashboard;
