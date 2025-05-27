
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle, AlertCircle } from "lucide-react";
import { format } from "date-fns";

const DirectProcessingAlerts = ({ alerts, onViewOffloadForm }) => {
  if (!alerts || alerts.length === 0) return null;

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getAlertVariant = (type) => {
    switch (type) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-4 mb-6">
      {alerts.map((alert, index) => (
        <Alert key={index} variant={getAlertVariant(alert.type)} className="border-2">
          <div className="flex items-center gap-2">
            {getAlertIcon(alert.type)}
            <AlertTitle className="flex items-center justify-between w-full">
              {alert.title}
              <Button 
                size="sm" 
                variant="outline"
                onClick={onViewOffloadForm}
                className="ml-4"
              >
                Go to Offload Form
              </Button>
            </AlertTitle>
          </div>
          <AlertDescription className="mt-2">
            <p className="mb-3">{alert.message}</p>
            <div className="space-y-2">
              {alert.records.map((record, recordIndex) => (
                <div key={recordIndex} className="flex items-center justify-between bg-background/50 p-2 rounded border">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                      {record.batch_id}
                    </Badge>
                    <span className="text-sm">
                      {record.milk_volume}L from {record.supplier_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(record.created_at), 'MMM dd, HH:mm')}
                    </span>
                  </div>
                  <div className="text-sm font-medium">
                    {record.timeRemaining ? (
                      <span className="text-orange-600">
                        {record.hoursRemaining}h {record.minutesRemaining}m remaining
                      </span>
                    ) : (
                      <span className="text-red-600">
                        {record.hoursOverdue}h overdue
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

export default DirectProcessingAlerts;
