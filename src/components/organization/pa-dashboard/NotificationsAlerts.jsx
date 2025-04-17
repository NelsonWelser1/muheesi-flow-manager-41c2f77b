
import React, { useState } from 'react';
import { BellRing, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

const NotificationsAlerts = () => {
  // Mock notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Loan Payment Due", entity: "Kyalima Farmers", time: "2 hours ago", type: "warning", read: false },
    { id: 2, title: "New Export Order", entity: "Fresheco Farming Limited", time: "1 hour ago", type: "info", read: false },
    { id: 3, title: "Stock Level Low: Packaging Materials", entity: "Grand Berna Dairies", time: "3 hours ago", type: "alert", read: false },
    { id: 4, title: "Payroll Processing Required", entity: "KAJON Coffee Limited", time: "4 hours ago", type: "warning", read: false },
    { id: 5, title: "Document Approval Needed", entity: "Bukomero Dairy Farm", time: "5 hours ago", type: "info", read: false }
  ]);
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
    toast.success("Notification marked as read");
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    toast.success("All notifications marked as read");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <BellRing className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 px-1.5 min-w-[20px] h-5 flex items-center justify-center"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 max-h-[70vh] overflow-auto">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Notifications</h4>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                Mark all as read
              </Button>
            )}
          </div>
          <div className="border-t pt-2 space-y-1">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-md cursor-pointer ${notification.read ? 'opacity-70' : ''}`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                    notification.type === 'warning' ? 'bg-yellow-500' : 
                    notification.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <h5 className="text-sm font-medium">{notification.title}</h5>
                    <p className="text-xs text-muted-foreground">{notification.entity}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                      {notification.read && <Check className="h-3 w-3 text-green-500" />}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <BellRing className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            )}
          </div>
          <Button variant="outline" size="sm" className="w-full text-xs">
            View All Notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsAlerts;
