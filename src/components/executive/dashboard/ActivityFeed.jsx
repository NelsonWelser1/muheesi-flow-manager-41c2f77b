
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Package, Users, DollarSign, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ActivityFeed = ({ activities = [], loading }) => {
  // Sample activity data if no real data available
  const sampleActivities = activities.length > 0 ? activities : [
    {
      id: 1,
      type: "sales",
      company: "KAJON Coffee Limited",
      module: "Sales System",
      summary: "New export sale of 2.5 tons of coffee to German buyer",
      timestamp: "2025-04-21 09:15:24"
    },
    {
      id: 2,
      type: "inventory",
      company: "Grand Berna Dairies",
      module: "Inventory Management",
      summary: "Milk production increased by 15% this week",
      timestamp: "2025-04-21 08:42:18"
    },
    {
      id: 3,
      type: "approval",
      company: "Kyalima Farmers Limited",
      module: "Purchase Approvals",
      summary: "New tractor purchase request awaiting approval",
      timestamp: "2025-04-20 16:30:45"
    },
    {
      id: 4,
      type: "operations",
      company: "Fresheco Farming",
      module: "Farm Operations",
      summary: "Harvest yield exceeded expectations by 22%",
      timestamp: "2025-04-20 14:18:32"
    },
    {
      id: 5,
      type: "personnel",
      company: "Grand Berna Dairies",
      module: "HR Management",
      summary: "3 new employees onboarded in production department",
      timestamp: "2025-04-19 10:45:12"
    },
    {
      id: 6,
      type: "finance",
      company: "KAJON Coffee Limited",
      module: "Finance Department",
      summary: "Monthly financial reports completed and ready for review",
      timestamp: "2025-04-19 09:22:08"
    },
    {
      id: 7,
      type: "sales",
      company: "Fresheco Farming",
      module: "Sales System",
      summary: "New contract secured with Shoprite for fresh produce supply",
      timestamp: "2025-04-18 15:56:39"
    },
    {
      id: 8,
      type: "operations",
      company: "Kyalima Farmers Limited",
      module: "Field Operations",
      summary: "New irrigation system implementation completed on north fields",
      timestamp: "2025-04-18 11:34:27"
    },
    {
      id: 9,
      type: "approval",
      company: "KAJON Coffee Limited",
      module: "Marketing Department",
      summary: "New marketing campaign budget awaiting approval",
      timestamp: "2025-04-17 16:08:15"
    },
    {
      id: 10,
      type: "inventory",
      company: "Grand Berna Dairies",
      module: "Warehouse Management",
      summary: "Low stock alert for packaging materials",
      timestamp: "2025-04-17 14:22:54"
    }
  ];
  
  const displayActivities = sampleActivities;
  
  // Function to get icon based on activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'sales':
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'inventory':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'personnel':
        return <Users className="h-5 w-5 text-purple-600" />;
      case 'operations':
        return <Activity className="h-5 w-5 text-orange-600" />;
      case 'approval':
        return <Clock className="h-5 w-5 text-amber-600" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'finance':
        return <DollarSign className="h-5 w-5 text-[#6E59A5]" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-600" />;
    }
  };
  
  const getActivityBadge = (type) => {
    switch (type) {
      case 'sales':
        return <Badge className="bg-green-100 text-green-800">Sales</Badge>;
      case 'inventory':
        return <Badge className="bg-blue-100 text-blue-800">Inventory</Badge>;
      case 'personnel':
        return <Badge className="bg-[#E5DEFF] text-[#6E59A5]">Personnel</Badge>;
      case 'operations':
        return <Badge className="bg-[#FDE1D3] text-orange-800">Operations</Badge>;
      case 'approval':
        return <Badge className="bg-[#FEF7CD] text-amber-800">Approval</Badge>;
      case 'alert':
        return <Badge className="bg-red-100 text-red-800">Alert</Badge>;
      case 'finance':
        return <Badge className="bg-green-100 text-green-800">Finance</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Update</Badge>;
    }
  };
  
  const formatTimeAgo = (timestamp) => {
    // Simple time ago formatter
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now - activityTime;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading activity feed...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Activity Feed</h2>
        <Button variant="outline" size="sm">
          Refresh
        </Button>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {displayActivities.map((activity) => (
              <div key={activity.id} className="border-b pb-4 last:border-0">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-full">
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{activity.company}</span>
                        <span className="text-xs text-[#8E9196]">• {activity.module}</span>
                        {getActivityBadge(activity.type)}
                      </div>
                      <span className="text-xs text-[#8E9196]">
                        {activity.timestamp ? formatTimeAgo(activity.timestamp) : 'Recent'}
                      </span>
                    </div>
                    
                    <p className="text-sm">{activity.summary}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-6">
            <Button variant="outline">Load More Activities</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityFeed;
