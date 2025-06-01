
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, AlertTriangle, Droplet } from 'lucide-react';
import { useDirectProcessingMonitor } from './hooks/useDirectProcessingMonitor';

const DirectProcessingAlerts = () => {
  const { activeAlerts, calculateTankCapacity } = useDirectProcessingMonitor();

  if (activeAlerts.length === 0) {
    return null;
  }

  const formatTimeRemaining = (timeMs) => {
    const hours = Math.floor(timeMs / (1000 * 60 * 60));
    const minutes = Math.floor((timeMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getSuggestedTank = (volume) => {
    const tankACapacity = calculateTankCapacity('Tank A');
    const tankBCapacity = calculateTankCapacity('Tank B');
    
    if (volume <= tankACapacity && volume <= tankBCapacity) {
      return tankACapacity >= tankBCapacity ? 'Tank A' : 'Tank B';
    } else if (volume <= tankACapacity) {
      return 'Tank A';
    } else if (volume <= tankBCapacity) {
      return 'Tank B';
    }
    return null;
  };

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertTriangle className="h-5 w-5" />
          Direct Processing Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeAlerts.map((alert) => {
          const suggestedTank = getSuggestedTank(alert.milk_volume);
          const isUrgent = alert.timeRemaining < (1 * 60 * 60 * 1000); // Less than 1 hour
          
          return (
            <Alert 
              key={alert.id} 
              className={`${isUrgent ? 'border-red-300 bg-red-50' : 'border-yellow-300 bg-yellow-50'}`}
            >
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplet className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{alert.milk_volume}L</span>
                      <span className="text-sm text-gray-600">
                        from {alert.supplier_name}
                      </span>
                    </div>
                    <div className={`text-sm font-medium ${isUrgent ? 'text-red-600' : 'text-orange-600'}`}>
                      {formatTimeRemaining(alert.timeRemaining)} remaining
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    {suggestedTank ? (
                      <span className="text-green-700">
                        💡 Suggested: Transfer to {suggestedTank} 
                        (Available: {calculateTankCapacity(suggestedTank).toFixed(1)}L)
                      </span>
                    ) : (
                      <span className="text-red-700">
                        ⚠️ No available tank capacity - Process immediately!
                      </span>
                    )}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          );
        })}
        
        <div className="mt-3 text-xs text-gray-600 bg-white p-2 rounded border">
          🔊 Audio alerts will sound every 30 minutes until milk is processed or transferred
        </div>
      </CardContent>
    </Card>
  );
};

export default DirectProcessingAlerts;
