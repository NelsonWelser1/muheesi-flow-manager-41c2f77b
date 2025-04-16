
import React, { useState } from 'react';
import { Bell, MessageSquare, Calendar, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const InternalNotifications = () => {
  const [notifications, setNotifications] = useState({
    alerts: [
      { id: 1, type: 'alert', title: 'System Update Required', message: 'Please update your system to the latest version.', time: '2 hours ago', read: false },
      { id: 2, type: 'alert', title: 'Security Alert', message: 'Unusual login activity detected from your account.', time: '1 day ago', read: false },
      { id: 3, type: 'alert', title: 'Password Expiry', message: 'Your password will expire in 5 days.', time: '2 days ago', read: true },
    ],
    messages: [
      { id: 4, type: 'message', sender: 'Nelson Namanya', title: 'Meeting Notes', message: 'I\'ve shared the notes from our meeting yesterday.', time: '30 minutes ago', read: false },
      { id: 5, type: 'message', sender: 'Geoffrey Muheesi', title: 'Strategy Document', message: 'Please review the new strategy document for Q2.', time: '3 hours ago', read: false },
      { id: 6, type: 'message', sender: 'HR Department', title: 'Employee Training', message: 'New employee training session scheduled for next week.', time: '1 day ago', read: true },
    ],
    events: [
      { id: 7, type: 'event', title: 'Board Meeting', message: 'Scheduled for tomorrow at 10:00 AM.', time: '1 day ago', read: false },
      { id: 8, type: 'event', title: 'Sales Team Meeting', message: 'Weekly sales meeting at 2:00 PM today.', time: '5 hours ago', read: false },
      { id: 9, type: 'event', title: 'System Maintenance', message: 'Scheduled system maintenance on Saturday.', time: '2 days ago', read: true },
    ]
  });

  const [open, setOpen] = useState(false);
  
  const unreadCount = Object.values(notifications).flat().filter(n => !n.read).length;
  
  const markAsRead = (id) => {
    const updatedNotifications = { ...notifications };
    
    for (const type in updatedNotifications) {
      updatedNotifications[type] = updatedNotifications[type].map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      );
    }
    
    setNotifications(updatedNotifications);
  };
  
  const markAllAsRead = () => {
    const updatedNotifications = { ...notifications };
    
    for (const type in updatedNotifications) {
      updatedNotifications[type] = updatedNotifications[type].map(notification => 
        ({ ...notification, read: true })
      );
    }
    
    setNotifications(updatedNotifications);
  };
  
  const getIconForType = (type) => {
    switch (type) {
      case 'alert': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'message': return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'event': return <Calendar className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };
  
  const renderNotification = (notification) => (
    <div 
      key={notification.id} 
      className={`mb-2 p-3 rounded-lg border ${notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-100'}`}
      onClick={() => markAsRead(notification.id)}
    >
      <div className="flex items-start gap-2">
        <div className="mt-1">{getIconForType(notification.type)}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-medium">{notification.title}</h4>
            {!notification.read && <div className="h-2 w-2 rounded-full bg-blue-500"></div>}
          </div>
          {notification.sender && (
            <p className="text-xs text-gray-600">From: {notification.sender}</p>
          )}
          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
        </div>
      </div>
    </div>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
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
      <PopoverContent className="w-[350px] p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-medium">Notifications</h3>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead} 
              disabled={unreadCount === 0}
              className="text-xs h-8"
            >
              <CheckCircle className="h-3.5 w-3.5 mr-1" />
              Mark all read
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="alerts" className="text-xs">Alerts</TabsTrigger>
            <TabsTrigger value="messages" className="text-xs">Messages</TabsTrigger>
            <TabsTrigger value="events" className="text-xs">Events</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[300px]">
            <TabsContent value="all" className="p-3 space-y-2">
              {[...notifications.alerts, ...notifications.messages, ...notifications.events]
                .sort((a, b) => a.read - b.read || b.id - a.id)
                .map(renderNotification)}
            </TabsContent>
            
            <TabsContent value="alerts" className="p-3 space-y-2">
              {notifications.alerts
                .sort((a, b) => a.read - b.read || b.id - a.id)
                .map(renderNotification)}
            </TabsContent>
            
            <TabsContent value="messages" className="p-3 space-y-2">
              {notifications.messages
                .sort((a, b) => a.read - b.read || b.id - a.id)
                .map(renderNotification)}
            </TabsContent>
            
            <TabsContent value="events" className="p-3 space-y-2">
              {notifications.events
                .sort((a, b) => a.read - b.read || b.id - a.id)
                .map(renderNotification)}
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <div className="p-2 border-t">
          <Button variant="ghost" size="sm" className="w-full text-xs">
            View All Notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default InternalNotifications;
