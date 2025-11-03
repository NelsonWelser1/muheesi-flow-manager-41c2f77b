
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  FileText,
  Users,
  Calendar,
  Settings
} from 'lucide-react';

const NotificationsAlerts = () => {
  const [notifications] = useState([
    {
      id: 1,
      type: 'urgent',
      icon: AlertTriangle,
      title: 'KAJON Coffee Export Documentation Due',
      message: 'Export permits and certificates need review by 3:00 PM today',
      company: 'KAJON Coffee Limited',
      time: '30 minutes ago',
      read: false,
      category: 'Operations'
    },
    {
      id: 2,
      type: 'important',
      icon: DollarSign,
      title: 'Loan Payment Due Reminder',
      message: 'Kyalima Farmers Limited loan payment of 1.2M UGX due in 2 days',
      company: 'Kyalima Farmers Limited',
      time: '2 hours ago',
      read: false,
      category: 'Financial'
    },
    {
      id: 3,
      type: 'info',
      icon: Calendar,
      title: 'Board Meeting Scheduled',
      message: 'Quarterly review meeting scheduled for June 15th, 2024',
      company: 'All Companies',
      time: '4 hours ago',
      read: true,
      category: 'Administrative'
    },
    {
      id: 4,
      type: 'success',
      icon: CheckCircle,
      title: 'Q1 Financial Report Completed',
      message: 'Financial report has been successfully generated and uploaded',
      company: 'All Companies',
      time: '1 day ago',
      read: true,
      category: 'Reports'
    },
    {
      id: 5,
      type: 'warning',
      icon: Clock,
      title: 'Insurance Policy Renewal',
      message: 'Farm insurance policy expires in 30 days - renewal required',
      company: 'Kyalima Farmers Limited',
      time: '1 day ago',
      read: false,
      category: 'Compliance'
    },
    {
      id: 6,
      type: 'info',
      icon: Users,
      title: 'New Employee Onboarding',
      message: '3 new employees starting next week - prepare orientation materials',
      company: 'Grand Berna Dairies',
      time: '2 days ago',
      read: true,
      category: 'HR'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationColor = (type) => {
    switch (type) {
      case 'urgent': return 'text-destructive bg-destructive/10';
      case 'important': return 'text-warning bg-warning/10';
      case 'warning': return 'text-warning bg-warning/10';
      case 'success': return 'text-success bg-success/10';
      case 'info': return 'text-primary bg-primary/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const getPriorityBadge = (type) => {
    switch (type) {
      case 'urgent': return <Badge className="bg-destructive">Urgent</Badge>;
      case 'important': return <Badge className="bg-warning">Important</Badge>;
      case 'warning': return <Badge className="bg-warning">Warning</Badge>;
      case 'success': return <Badge className="bg-success">Success</Badge>;
      default: return <Badge variant="outline">Info</Badge>;
    }
  };

  const groupedNotifications = {
    urgent: notifications.filter(n => n.type === 'urgent'),
    important: notifications.filter(n => n.type === 'important' || n.type === 'warning'),
    general: notifications.filter(n => n.type === 'info' || n.type === 'success')
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-destructive text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{unreadCount} unread</Badge>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-0 rounded-none border-b">
                <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                <TabsTrigger value="urgent" className="text-xs">Urgent</TabsTrigger>
                <TabsTrigger value="important" className="text-xs">Important</TabsTrigger>
                <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border-b hover:bg-muted/5 cursor-pointer ${
                        !notification.read ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                          <notification.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm truncate">{notification.title}</h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getPriorityBadge(notification.type)}
                              <Badge variant="outline" className="text-xs">{notification.category}</Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{notification.company}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="urgent" className="mt-0">
                <div className="max-h-96 overflow-y-auto">
                  {groupedNotifications.urgent.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border-b hover:bg-muted/5 cursor-pointer ${
                        !notification.read ? 'bg-destructive/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                          <notification.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm truncate">{notification.title}</h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-destructive rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <Badge className="bg-destructive text-xs">Urgent</Badge>
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {groupedNotifications.urgent.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mx-auto mb-3 text-success" />
                      <p className="text-sm">No urgent notifications</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="important" className="mt-0">
                <div className="max-h-96 overflow-y-auto">
                  {groupedNotifications.important.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border-b hover:bg-muted/5 cursor-pointer ${
                        !notification.read ? 'bg-warning/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                          <notification.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm truncate">{notification.title}</h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-warning rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            {getPriorityBadge(notification.type)}
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="general" className="mt-0">
                <div className="max-h-96 overflow-y-auto">
                  {groupedNotifications.general.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border-b hover:bg-muted/5 cursor-pointer ${
                        !notification.read ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                          <notification.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm truncate">{notification.title}</h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            {getPriorityBadge(notification.type)}
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="p-3 border-t bg-muted/10">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  Mark All Read
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  View All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsAlerts;
