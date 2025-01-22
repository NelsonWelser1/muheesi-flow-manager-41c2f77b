import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const InventoryAlerts = () => {
  const { toast } = useToast();
  
  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: 'Low stock alert: Fresh Milk below threshold',
      timestamp: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      type: 'critical',
      message: 'Stock expiring soon: Yogurt batch YB-001',
      timestamp: '2024-01-15T11:15:00Z'
    },
    {
      id: 3,
      type: 'info',
      message: 'New stock received: Cheese production materials',
      timestamp: '2024-01-15T12:00:00Z'
    }
  ];

  const handleAlertClick = (alert) => {
    toast({
      title: "Alert Details",
      description: alert.message,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">Inventory Alerts</CardTitle>
        <Bell className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
              onClick={() => handleAlertClick(alert)}
            >
              <div className="flex items-center space-x-3">
                {alert.type === 'warning' && (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
                {alert.type === 'critical' && (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
                {alert.type === 'info' && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                <div>
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  alert.type === 'warning'
                    ? 'warning'
                    : alert.type === 'critical'
                    ? 'destructive'
                    : 'default'
                }
              >
                {alert.type}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryAlerts;