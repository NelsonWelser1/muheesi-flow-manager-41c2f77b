
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, X, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const NotificationManager = ({ 
  sectionId, 
  notifications, 
  onMarkAsRead, 
  onClearAll,
  onAddNotification 
}) => {
  const { toast } = useToast();

  const notificationTypes = {
    'cheese-factory': [
      { id: 1, type: 'warning', message: 'Tank A requires maintenance check', priority: 'high' },
      { id: 2, type: 'info', message: 'New milk batch received', priority: 'medium' },
      { id: 3, type: 'alert', message: 'Quality check needed for Batch #2024-001', priority: 'high' }
    ],
    'sales-accounts': [
      { id: 1, type: 'info', message: 'New sales order received', priority: 'medium' },
      { id: 2, type: 'warning', message: 'Payment overdue for Invoice #001', priority: 'high' }
    ],
    'dairy-coolers': [
      { id: 1, type: 'alert', message: 'Temperature variance detected', priority: 'high' }
    ],
    'yogurt-processing': [
      { id: 1, type: 'info', message: 'Fermentation cycle completed', priority: 'medium' }
    ],
    'slaughterhouse': [
      { id: 1, type: 'warning', message: 'Equipment maintenance due', priority: 'high' },
      { id: 2, type: 'info', message: 'New procurement order', priority: 'low' }
    ],
    'personnel': [
      { id: 1, type: 'info', message: 'New training session scheduled', priority: 'medium' },
      { id: 2, type: 'warning', message: 'Employee performance review due', priority: 'medium' },
      { id: 3, type: 'alert', message: 'Safety incident report pending', priority: 'high' },
      { id: 4, type: 'info', message: 'Payroll processing complete', priority: 'low' }
    ],
    'reports': [
      { id: 1, type: 'info', message: 'Monthly report generation ready', priority: 'medium' }
    ]
  };

  const sectionNotifications = notificationTypes[sectionId] || [];

  const handleMarkAsRead = (notificationId) => {
    onMarkAsRead(sectionId, 1);
    toast({
      title: "Notification Marked as Read",
      description: "Notification has been marked as read",
      duration: 3000,
    });
  };

  const handleClearAll = () => {
    onClearAll(sectionId);
    toast({
      title: "All Notifications Cleared",
      description: `All notifications for this section have been cleared`,
      duration: 3000,
    });
  };

  const getIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'alert': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-red-300';
      case 'medium': return 'bg-amber-100 border-amber-300';
      default: return 'bg-blue-100 border-blue-300';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
          {notifications > 0 && (
            <Badge variant="secondary" className="bg-red-500 text-white">
              {notifications}
            </Badge>
          )}
        </CardTitle>
        {notifications > 0 && (
          <Button variant="outline" size="sm" onClick={handleClearAll}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {notifications === 0 ? (
          <p className="text-center text-gray-500 py-4">No new notifications</p>
        ) : (
          <div className="space-y-3">
            {sectionNotifications.slice(0, notifications).map((notification) => (
              <div 
                key={notification.id}
                className={`p-3 rounded-lg border ${getPriorityColor(notification.priority)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    {getIcon(notification.type)}
                    <div>
                      <p className="text-sm font-medium">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Priority: {notification.priority}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationManager;
