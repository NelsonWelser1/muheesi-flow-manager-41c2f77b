
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Bell, 
  Calendar, 
  Clock, 
  MapPin,
  ChevronRight,
  Activity,
  Briefcase,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CompanyQuickAccess from './CompanyQuickAccess';
import SystemMetrics from './SystemMetrics';
import RecentActivities from './RecentActivities';

const EmployeeDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user] = useState({
    name: "Employee",
    role: "System User",
    company: "GKK Integrated",
    location: "Uganda"
  });
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const quickActions = [
    { 
      title: "Manage Inventory", 
      path: "/manage-inventory", 
      icon: Building2, 
      color: "bg-blue-500",
      description: "Access all company inventories"
    },
    { 
      title: "Company Management", 
      path: "/manage-companies", 
      icon: Users, 
      color: "bg-green-500",
      description: "Manage company operations"
    },
    { 
      title: "Export Business", 
      path: "/manage-inventory/kajon-export", 
      icon: TrendingUp, 
      color: "bg-purple-500",
      description: "KAJON Coffee exports"
    },
    { 
      title: "Dairy Operations", 
      path: "/manage-inventory/bukomero-dairy", 
      icon: Activity, 
      color: "bg-orange-500",
      description: "Bukomero Dairy management"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome to GKK Integrated System
          </h1>
          <p className="text-lg text-gray-600">
            Your comprehensive business management platform
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {currentTime.toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {user.location}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1">
            {user.role}
          </Badge>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <Card 
              key={action.title} 
              className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => navigate(action.path)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-lg ${action.color} text-white`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CompanyQuickAccess />
            <SystemMetrics />
          </div>
        </TabsContent>
        
        <TabsContent value="companies">
          <CompanyQuickAccess expanded />
        </TabsContent>
        
        <TabsContent value="metrics">
          <SystemMetrics expanded />
        </TabsContent>
        
        <TabsContent value="activities">
          <RecentActivities />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeDashboard;
