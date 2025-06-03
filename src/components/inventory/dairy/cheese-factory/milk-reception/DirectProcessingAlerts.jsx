
import React from 'react';
import { AlertTriangle, Clock, Droplet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOperationalAlerts } from '@/hooks/useOperationalAlerts';

const DirectProcessingAlerts = () => {
  const { operationalAlerts, getCurrentDirectProcessingVolume } = useOperationalAlerts();
  
  // Get current milk data
  const { totalVolume, entries } = getCurrentDirectProcessingVolume();
  
  // Filter for direct processing alerts only
  const directProcessingAlerts = operationalAlerts.filter(alert => 
    alert.id === 'direct-processing-current'
  );

  if (totalVolume <= 0 && directProcessingAlerts.length === 0) {
    return (
      <Card className="w-80">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Droplet className="h-5 w-5 text-blue-500" />
            Direct Processing Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-sm text-gray-500">
              No milk currently in Direct Processing
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-80">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Droplet className="h-5 w-5 text-blue-500" />
          Direct Processing Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Current Milk Status */}
        {totalVolume > 0 && (
          <div className="p-3 rounded-lg border-2 border-blue-200 bg-blue-50">
            <div className="flex items-start gap-3">
              <Droplet className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-blue-900">
                  Current Milk: {totalVolume.toFixed(1)}L
                </h4>
                <div className="mt-1 space-y-1">
                  {entries.map((entry, index) => {
                    const minutesSinceSubmission = (new Date() - entry.submissionTime) / (1000 * 60);
                    return (
                      <div key={entry.id} className="text-xs text-blue-700 flex justify-between">
                        <span>{entry.milk_volume.toFixed(1)}L from {entry.supplier_name}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {Math.floor(minutesSinceSubmission)}m ago
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Urgent Alerts */}
        {directProcessingAlerts.map(alert => (
          <div key={alert.id} className="p-3 rounded-lg border-2 border-orange-200 bg-orange-50 w-72">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-medium text-orange-900">
                    {alert.title}
                  </h4>
                  {alert.priority === 'high' && (
                    <Badge variant="destructive" className="text-xs px-1.5 py-0.5 flex-shrink-0">
                      URGENT
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-orange-700 mt-1">
                  {alert.message}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Action Button */}
        {totalVolume > 0 && (
          <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
            Process Milk Now
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DirectProcessingAlerts;
