
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Users, 
  FileText, 
  Settings, 
  TrendingUp, 
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SystemAdminDashboard = () => {
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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">System Administrator Dashboard</h3>
        <p className="text-lg text-gray-600">
          Manage system operations and oversee all company activities
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
    </div>
  );
};

export default SystemAdminDashboard;
