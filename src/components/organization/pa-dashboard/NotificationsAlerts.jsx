
import React from 'react';
import { BellRing } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const NotificationsAlerts = () => {
  // Mock notifications
  const notifications = [
    { id: 1, title: "Loan Payment Due", entity: "Kyalima Farmers", time: "2 hours ago", type: "warning" },
    { id: 2, title: "New Export Order", entity: "Fresheco Farming Limited", time: "1 hour ago", type: "info" },
    { id: 3, title: "Stock Level Low: Packaging Materials", entity: "Grand Berna Dairies", time: "3 hours ago", type: "alert" }
  ];
  
  const unreadCount = notifications.length;
  
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
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium">Notifications</h4>
          <div className="border-t pt-2">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                <div className={`mt-1 h-2 w-2 rounded-full ${
                  notification.type === 'warning' ? 'bg-yellow-500' : 
                  notification.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'
                }`}></div>
                <div>
                  <h5 className="text-sm font-medium">{notification.title}</h5>
                  <p className="text-xs text-muted-foreground">{notification.entity}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="w-full text-xs">
            View All Notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsAlerts;
