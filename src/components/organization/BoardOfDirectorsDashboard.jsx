
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  AlertTriangle, 
  BarChart3, 
  Building2,
  PieChart,
  Target,
  Shield,
  FileText,
  Eye
} from 'lucide-react';
import CompanyOverview from './board-dashboard/CompanyOverview';
import FinancialSummary from './board-dashboard/FinancialSummary';
import OperationalStatus from './board-dashboard/OperationalStatus';
import RiskCompliance from './board-dashboard/RiskCompliance';
import PerformanceMetrics from './board-dashboard/PerformanceMetrics';
import StrategicReports from './board-dashboard/StrategicReports';

const BoardOfDirectorsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const boardMetrics = [
    {
      title: "Total Portfolio Value",
      value: "$14.5M",
      change: "+8.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-success"
    },
    {
      title: "Active Companies",
      value: "3",
      change: "Stable",
      trend: "stable",
      icon: Building2,
      color: "text-primary"
    },
    {
      title: "Total Employees",
      value: "737",
      change: "+12",
      trend: "up",
      icon: Users,
      color: "text-accent"
    },
    {
      title: "Risk Alerts",
      value: "1",
      change: "-1",
      trend: "down",
      icon: AlertTriangle,
      color: "text-destructive"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Board of Directors Dashboard</h2>
          <p className="text-muted-foreground">
            Strategic oversight and governance across all company operations
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
            <Eye className="h-3 w-3 mr-1" />
            View Only
          </Badge>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {boardMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className={`text-sm ${metric.color} flex items-center`}>
                    {metric.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
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
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Financial</span>
          </TabsTrigger>
          <TabsTrigger value="operations" className="flex items-center gap-1">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Operations</span>
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Risk</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Performance</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <CompanyOverview />
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <FinancialSummary />
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <OperationalStatus />
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <RiskCompliance />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceMetrics />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <StrategicReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BoardOfDirectorsDashboard;
