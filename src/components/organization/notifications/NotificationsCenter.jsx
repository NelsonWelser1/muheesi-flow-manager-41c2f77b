import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Bell, 
  Mail,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Info,
  Trash2,
  Settings
} from 'lucide-react';

const NotificationsCenter = () => {
  const [notifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Database Backup Completed',
      message: 'Scheduled backup completed successfully at 2:00 AM',
      timestamp: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'High CPU Usage Detected',
      message: 'CPU usage exceeded 80% threshold for 5 minutes',
      timestamp: '5 hours ago',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'New User Registration',
      message: 'A new user has registered and is awaiting role assignment',
      timestamp: '1 day ago',
      read: true
    },
    {
      id: 4,
      type: 'error',
      title: 'Failed Login Attempts',
      message: 'Multiple failed login attempts detected from IP 192.168.1.100',
      timestamp: '1 day ago',
      read: true
    }
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    securityAlerts: true,
    systemUpdates: true,
    userActivity: false,
    backupAlerts: true
  });

  const handleToggleSetting = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    toast.success("Notification settings updated");
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'info':
        return <Info className="h-5 w-5 text-primary" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getNotificationBgColor = (type) => {
    switch(type) {
      case 'success':
        return 'bg-success/10';
      case 'warning':
        return 'bg-warning/10';
      case 'error':
        return 'bg-destructive/10';
      case 'info':
        return 'bg-primary/10';
      default:
        return 'bg-muted/50';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Notifications Center
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">{unreadCount}</Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage system notifications and alert configurations
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            All Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">{unreadCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>All system and user notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    !notification.read ? 'border-primary' : ''
                  } ${getNotificationBgColor(notification.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{notification.title}</p>
                          {!notification.read && (
                            <Badge variant="default" className="text-xs">New</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Unread Notifications</CardTitle>
              <CardDescription>Notifications requiring your attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.filter(n => !n.read).length > 0 ? (
                notifications.filter(n => !n.read).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border border-primary ${getNotificationBgColor(notification.type)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{notification.title}</p>
                            <Badge variant="default" className="text-xs">New</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.timestamp}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto text-success mb-3" />
                  <p className="text-lg font-medium">All caught up!</p>
                  <p className="text-sm text-muted-foreground">No unread notifications</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Delivery Methods
                </h3>
                <div className="space-y-4 pl-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={() => handleToggleSetting('emailNotifications')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                    </div>
                    <Switch
                      id="push"
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={() => handleToggleSetting('pushNotifications')}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Notification Types
                </h3>
                <div className="space-y-4 pl-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="security">Security Alerts</Label>
                      <p className="text-sm text-muted-foreground">Failed logins, suspicious activity</p>
                    </div>
                    <Switch
                      id="security"
                      checked={notificationSettings.securityAlerts}
                      onCheckedChange={() => handleToggleSetting('securityAlerts')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="updates">System Updates</Label>
                      <p className="text-sm text-muted-foreground">Maintenance, updates, downtimes</p>
                    </div>
                    <Switch
                      id="updates"
                      checked={notificationSettings.systemUpdates}
                      onCheckedChange={() => handleToggleSetting('systemUpdates')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="activity">User Activity</Label>
                      <p className="text-sm text-muted-foreground">New registrations, role changes</p>
                    </div>
                    <Switch
                      id="activity"
                      checked={notificationSettings.userActivity}
                      onCheckedChange={() => handleToggleSetting('userActivity')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="backups">Backup Alerts</Label>
                      <p className="text-sm text-muted-foreground">Backup success/failure notifications</p>
                    </div>
                    <Switch
                      id="backups"
                      checked={notificationSettings.backupAlerts}
                      onCheckedChange={() => handleToggleSetting('backupAlerts')}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsCenter;
