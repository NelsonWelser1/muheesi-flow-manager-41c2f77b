
import React, { useState } from 'react';
import { Bell, BellRing, X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from '@/hooks/useNotifications';
import { useOperationalAlerts } from '@/hooks/useOperationalAlerts';

const NotificationCenter = () => {
  const { notifications, markAsRead, markAllAsRead, clearNotification } = useNotifications();
  const { operationalAlerts } = useOperationalAlerts();
  const [isOpen, setIsOpen] = useState(false);

  // Combine all notifications and sort by timestamp (newest first)
  const allNotifications = [...notifications, ...operationalAlerts]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  const unreadCount = allNotifications.filter(notif => !notif.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'operational':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationColors = (type, priority = 'medium') => {
    // Base colors by type
    const typeColors = {
      'success': 'bg-green-50 border-green-200 hover:bg-green-100',
      'warning': 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
      'error': 'bg-red-50 border-red-200 hover:bg-red-100',
      'operational': 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      'info': 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    };

    // Intensity based on priority
    const priorityIntensity = {
      'high': 'ring-2 ring-red-300 shadow-md',
      'medium': 'ring-1 ring-gray-200',
      'low': ''
    };

    return `${typeColors[type] || typeColors.info} ${priorityIntensity[priority] || priorityIntensity.medium}`;
  };

  const getTimeColor = (type, priority = 'medium') => {
    if (priority === 'high') return 'text-red-600 font-medium';
    if (type === 'error' || type === 'operational') return 'text-orange-600';
    return 'text-gray-500';
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const handleClearNotification = (e, notificationId) => {
    e.stopPropagation();
    clearNotification(notificationId);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 px-1.5 min-w-[20px] h-5 flex items-center justify-center"
              variant="destructive"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 max-h-[70vh] overflow-auto" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Mark all as read
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {allNotifications.length > 0 ? (
              allNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    getNotificationColors(notification.type, notification.priority)
                  } ${!notification.read ? 'shadow-sm' : 'opacity-75'}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                          {notification.title}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 hover:bg-red-100 flex-shrink-0"
                          onClick={(e) => handleClearNotification(e, notification.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs ${getTimeColor(notification.type, notification.priority)}`}>
                          {new Date(notification.timestamp).toLocaleString()}
                        </span>
                        <div className="flex items-center gap-2">
                          {notification.priority === 'high' && (
                            <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                              URGENT
                            </Badge>
                          )}
                          {!notification.read && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications</p>
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
