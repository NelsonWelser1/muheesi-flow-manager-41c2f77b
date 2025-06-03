
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Target,
  Calendar,
  FileText
} from 'lucide-react';

const DashboardOverview = ({ selectedEntity }) => {
  const companyOverview = [
    {
      name: "Grand Berna Dairies",
      status: "Excellent",
      revenue: "8.5M UGX",
      employees: 285,
      activeProjects: 8,
      pendingTasks: 3,
      urgentItems: 0,
      efficiency: 94
    },
    {
      name: "KAJON Coffee Limited", 
      status: "Good",
      revenue: "3.2M UGX",
      employees: 167,
      activeProjects: 5,
      pendingTasks: 7,
      urgentItems: 1,
      efficiency: 89
    },
    {
      name: "Kyalima Farmers Limited",
      status: "Good", 
      revenue: "2.8M UGX",
      employees: 285,
      activeProjects: 6,
      pendingTasks: 4,
      urgentItems: 0,
      efficiency: 85
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Excellent': return 'bg-green-500';
      case 'Good': return 'bg-blue-500';
      case 'Monitor': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const totalRevenue = companyOverview.reduce((sum, company) => {
    return sum + parseFloat(company.revenue.replace('M UGX', ''));
  }, 0);

  const totalEmployees = companyOverview.reduce((sum, company) => sum + company.employees, 0);
  const totalProjects = companyOverview.reduce((sum, company) => sum + company.activeProjects, 0);
  const totalUrgent = companyOverview.reduce((sum, company) => sum + company.urgentItems, 0);

  return (
    <div className="space-y-6">
      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Portfolio Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalRevenue.toFixed(1)}M UGX</p>
            <p className="text-xs text-green-600">+8.5% YoY Growth</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Workforce
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalEmployees}</p>
            <p className="text-xs text-blue-600">Across all entities</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalProjects}</p>
            <p className="text-xs text-muted-foreground">Strategic initiatives</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Urgent Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{totalUrgent}</p>
            <p className="text-xs text-muted-foreground">Require CEO attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Company Status Overview */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Company Performance Overview</h3>
        {companyOverview.map((company, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {company.name}
                </CardTitle>
                <Badge className={getStatusColor(company.status)}>
                  {company.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-xl font-bold">{company.revenue}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Employees</p>
                  <p className="text-xl font-bold">{company.employees}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Efficiency</p>
                  <div className="space-y-1">
                    <Progress value={company.efficiency} className="h-2" />
                    <p className="text-sm font-medium">{company.efficiency}%</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                  <p className="text-xl font-bold flex items-center gap-1">
                    {company.activeProjects}
                    <Target className="h-4 w-4 text-blue-500" />
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Pending Tasks</p>
                  <p className="text-xl font-bold flex items-center gap-1">
                    {company.pendingTasks}
                    <Clock className="h-4 w-4 text-yellow-500" />
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Urgent Items</p>
                  <p className="text-xl font-bold flex items-center gap-1">
                    {company.urgentItems}
                    {company.urgentItems === 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions for PA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Priority Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Review KAJON Coffee export documentation</p>
                  <p className="text-sm text-muted-foreground">Deadline: Today 3:00 PM</p>
                </div>
              </div>
              <Badge variant="destructive">Urgent</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Prepare weekly performance summary for CEO</p>
                  <p className="text-sm text-muted-foreground">Due: Tomorrow</p>
                </div>
              </div>
              <Badge variant="secondary">Important</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Schedule board meeting for next quarter review</p>
                  <p className="text-sm text-muted-foreground">This week</p>
                </div>
              </div>
              <Badge variant="outline">Scheduled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
