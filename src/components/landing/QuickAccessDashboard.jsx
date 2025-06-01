
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Users, 
  FileText, 
  Settings, 
  TrendingUp, 
  Calendar,
  Bell,
  Archive
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickAccessDashboard = () => {
  const navigate = useNavigate();
  
  const quickActions = [
    {
      title: "Inventory Management",
      description: "Manage stock across all companies",
      icon: Package,
      color: "bg-blue-500",
      action: () => navigate('/manage-inventory'),
      badge: "12 updates"
    },
    {
      title: "Company Management",
      description: "Access company-specific systems",
      icon: Users,
      color: "bg-green-500",
      action: () => navigate('/manage-companies'),
      badge: "3 active"
    },
    {
      title: "Reports & Analytics",
      description: "View performance metrics",
      icon: TrendingUp,
      color: "bg-purple-500",
      action: () => console.log('Reports'),
      badge: "New data"
    },
    {
      title: "Employee Accounts",
      description: "Manage user accounts and roles",
      icon: Users,
      color: "bg-orange-500",
      action: () => navigate('/manage-accounts'),
      badge: "5 pending"
    },
    {
      title: "System Settings",
      description: "Configure system preferences",
      icon: Settings,
      color: "bg-gray-500",
      action: () => console.log('Settings'),
      badge: null
    },
    {
      title: "Daily Schedule",
      description: "View today's operations",
      icon: Calendar,
      color: "bg-red-500",
      action: () => console.log('Schedule'),
      badge: "8 tasks"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Employee Quick Access</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Access your most used tools and get quick insights into system operations
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {quickActions.map((action, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`${action.color} p-3 rounded-lg`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                {action.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {action.badge}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                {action.title}
              </CardTitle>
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
      
      {/* Recent Activities */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-blue-900">Recent System Activity</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100">
              <Archive className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">New milk batch received at Grand Berna</p>
                <p className="text-sm text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100">
              <Package className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Coffee shipment prepared for export</p>
                <p className="text-sm text-gray-500">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100">
              <FileText className="h-4 w-4 text-purple-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Weekly production report generated</p>
                <p className="text-sm text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickAccessDashboard;
