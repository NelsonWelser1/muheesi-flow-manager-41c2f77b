
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Package, DollarSign, FileText } from 'lucide-react';

const RecentActivities = () => {
  const activities = [
    {
      id: 1,
      type: 'inventory',
      title: 'New coffee shipment received',
      company: 'KAJON Coffee Limited',
      time: '2 hours ago',
      icon: Package,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      id: 2,
      type: 'sales',
      title: 'Dairy products order completed',
      company: 'Grand Berna Dairies',
      time: '4 hours ago',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 3,
      type: 'user',
      title: 'New employee added to system',
      company: 'Kashari Farm',
      time: '6 hours ago',
      icon: User,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 4,
      type: 'report',
      title: 'Monthly report generated',
      company: 'Kyalima Farmers Limited',
      time: '1 day ago',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 5,
      type: 'inventory',
      title: 'Livestock health check completed',
      company: 'Kashari Farm',
      time: '1 day ago',
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const getActivityBadge = (type) => {
    const badges = {
      inventory: { label: 'Inventory', variant: 'secondary' },
      sales: { label: 'Sales', variant: 'default' },
      user: { label: 'User', variant: 'outline' },
      report: { label: 'Report', variant: 'secondary' }
    };
    return badges[type] || { label: 'Activity', variant: 'outline' };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const IconComponent = activity.icon;
            const badge = getActivityBadge(activity.type);
            
            return (
              <div
                key={activity.id}
                className={`p-4 rounded-lg border ${activity.bgColor} hover:shadow-sm transition-shadow`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-white ${activity.color} flex-shrink-0`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {activity.title}
                      </h4>
                      <Badge variant={badge.variant} className="text-xs flex-shrink-0">
                        {badge.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{activity.company}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
