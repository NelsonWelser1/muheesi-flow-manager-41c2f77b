
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Users, 
  FileText, 
  Settings, 
  TrendingUp, 
  Calendar,
  Shield,
  Database,
  Building2,
  Activity,
  AlertCircle,
  BarChart3,
  Server,
  UserCog,
  Bell,
  Lock,
  Globe,
  Coffee,
  Truck,
  Factory
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SystemAdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const systemMetrics = {
    totalUsers: 247,
    activeCompanies: 4,
    systemUptime: '99.8%',
    dataStorage: '2.3 TB',
    dailyTransactions: 1847,
    securityAlerts: 3
  };

  const companyOverview = [
    {
      name: "Grand Berna Dairies",
      status: "Active",
      employees: 89,
      lastActivity: "2 mins ago",
      systems: ["Factory", "Cold Room", "Logistics", "Sales"],
      alerts: 2
    },
    {
      name: "KAJON Coffee Limited",
      status: "Active", 
      employees: 67,
      lastActivity: "5 mins ago",
      systems: ["Farm Management", "Export", "Quality Control"],
      alerts: 1
    },
    {
      name: "Kyalima Farmers Limited",
      status: "Active",
      employees: 45,
      lastActivity: "1 hour ago", 
      systems: ["Rice Imports", "Bull Fattening", "Farm Operations"],
      alerts: 0
    },
    {
      name: "Fresheco Farming",
      status: "Active",
      employees: 46,
      lastActivity: "30 mins ago",
      systems: ["Inventory", "Exports", "Quality Control"],
      alerts: 1
    }
  ];

  const systemActions = [
    {
      title: "User Management",
      description: "Manage all user accounts, roles, and permissions across companies",
      icon: UserCog,
      color: "bg-blue-500",
      action: () => navigate('/manage-accounts'),
      category: "users"
    },
    {
      title: "Company Systems",
      description: "Access and manage company-specific systems and operations",
      icon: Building2,
      color: "bg-green-500", 
      action: () => navigate('/manage-companies'),
      category: "companies"
    },
    {
      title: "Inventory Management",
      description: "Centralized inventory control across all companies",
      icon: Package,
      color: "bg-purple-500",
      action: () => navigate('/manage-inventory'),
      category: "operations"
    },
    {
      title: "System Health Monitor",
      description: "Monitor system performance, uptime, and infrastructure",
      icon: Activity,
      color: "bg-red-500",
      action: () => console.log('System Health'),
      category: "system"
    },
    {
      title: "Database Management",
      description: "Manage databases, backups, and data integrity",
      icon: Database,
      color: "bg-indigo-500",
      action: () => console.log('Database Management'),
      category: "system"
    },
    {
      title: "Security Center",
      description: "Security policies, access control, and threat monitoring",
      icon: Shield,
      color: "bg-orange-500",
      action: () => console.log('Security Center'),
      category: "security"
    },
    {
      title: "Analytics & Reports",
      description: "System-wide analytics, performance metrics, and reporting",
      icon: BarChart3,
      color: "bg-cyan-500",
      action: () => console.log('Analytics'),
      category: "analytics"
    },
    {
      title: "Notifications Center",
      description: "Manage system notifications and alert configurations",
      icon: Bell,
      color: "bg-yellow-500",
      action: () => console.log('Notifications'),
      category: "system"
    },
    {
      title: "System Configuration",
      description: "Global system settings and configuration management",
      icon: Settings,
      color: "bg-gray-500",
      action: () => console.log('Configuration'),
      category: "system"
    }
  ];

  const renderSystemMetrics = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{systemMetrics.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Companies</p>
              <p className="text-2xl font-bold">{systemMetrics.activeCompanies}</p>
            </div>
            <Building2 className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Uptime</p>
              <p className="text-2xl font-bold">{systemMetrics.systemUptime}</p>
            </div>
            <Activity className="h-8 w-8 text-emerald-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Storage</p>
              <p className="text-2xl font-bold">{systemMetrics.dataStorage}</p>
            </div>
            <Database className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="text-2xl font-bold">{systemMetrics.dailyTransactions}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-cyan-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Alerts</p>
              <p className="text-2xl font-bold text-orange-500">{systemMetrics.securityAlerts}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCompanyOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {companyOverview.map((company, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{company.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{company.employees} employees</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={company.status === 'Active' ? 'default' : 'secondary'}>
                  {company.status}
                </Badge>
                {company.alerts > 0 && (
                  <Badge variant="destructive">{company.alerts} alerts</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4 text-green-500" />
                <span>Last activity: {company.lastActivity}</span>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Active Systems:</p>
                <div className="flex flex-wrap gap-1">
                  {company.systems.map((system, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {system}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => navigate('/manage-companies')}
              >
                Manage Company
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderActionsByCategory = (category) => {
    const filteredActions = systemActions.filter(action => action.category === category);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredActions.map((action, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`${action.color} p-3 rounded-lg`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                  {action.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{action.description}</p>
              <Button 
                onClick={action.action}
                className="w-full group-hover:bg-blue-600 transition-colors"
                variant="outline"
              >
                Access Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">System Administrator Dashboard</h3>
        <p className="text-lg text-gray-600">
          Centralized management and oversight of all system operations across companies
        </p>
      </div>
      
      {renderSystemMetrics()}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => navigate('/manage-inventory')}>
                    <Package className="h-4 w-4 mr-2" />
                    Inventory
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/manage-companies')}>
                    <Building2 className="h-4 w-4 mr-2" />
                    Companies
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/manage-accounts')}>
                    <UserCog className="h-4 w-4 mr-2" />
                    Accounts
                  </Button>
                  <Button variant="outline">
                    <Activity className="h-4 w-4 mr-2" />
                    Monitor
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>System Health</span>
                    <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Database Status</span>
                    <Badge className="bg-green-100 text-green-800">Online</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Backup Status</span>
                    <Badge className="bg-green-100 text-green-800">Up to date</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Security Level</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="companies">
          <Card>
            <CardHeader>
              <CardTitle>Company Management</CardTitle>
              <p className="text-muted-foreground">Monitor and manage all companies in the system</p>
            </CardHeader>
            <CardContent>
              {renderCompanyOverview()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          {renderActionsByCategory('users')}
        </TabsContent>

        <TabsContent value="operations">
          {renderActionsByCategory('operations')}
        </TabsContent>

        <TabsContent value="system">
          {renderActionsByCategory('system')}
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            {renderActionsByCategory('security')}
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-medium">Failed login attempts detected</p>
                        <p className="text-sm text-muted-foreground">Multiple failed attempts from IP 192.168.1.100</p>
                      </div>
                    </div>
                    <Badge variant="secondary">2 mins ago</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Security patch applied successfully</p>
                        <p className="text-sm text-muted-foreground">System updated to latest security version</p>
                      </div>
                    </div>
                    <Badge variant="secondary">1 hour ago</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemAdminDashboard;
