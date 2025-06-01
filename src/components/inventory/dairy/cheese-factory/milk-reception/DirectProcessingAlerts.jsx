
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, AlertTriangle, Droplet } from 'lucide-react';
import { useMilkReception } from '@/hooks/useMilkReception';

const DirectProcessingAlerts = () => {
  const { data: milkReceptionData } = useMilkReception();

  // Calculate current milk volume in Direct Processing
  const getCurrentDirectProcessingVolume = () => {
    if (!milkReceptionData) return [];

    // Get all Direct Processing records
    const directProcessingRecords = milkReceptionData
      .filter(record => record.tank_number === 'Direct-Processing')
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)); // Sort by time ascending

    if (directProcessingRecords.length === 0) return [];

    // Calculate total net volume (positive additions minus negative utilizations)
    const totalNetVolume = directProcessingRecords.reduce((total, record) => {
      return total + (record.milk_volume || 0);
    }, 0);

    // If no milk remaining, return empty array (no alerts)
    if (totalNetVolume <= 0) return [];

    // Get only positive records (milk additions) that are still valid
    const positiveRecords = directProcessingRecords.filter(r => r.milk_volume > 0);
    
    if (positiveRecords.length === 0) return [];

    // Find the most recent milk addition that still has volume remaining
    // We need to work backwards to find which milk is actually still in the tank
    const currentTime = new Date();
    let remainingVolume = totalNetVolume;
    const activeAlerts = [];

    // Process positive records in reverse chronological order (most recent first)
    // to determine which milk is actually still present
    const sortedPositiveRecords = [...positiveRecords].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    for (const record of sortedPositiveRecords) {
      if (remainingVolume > 0) {
        const submissionTime = new Date(record.created_at);
        const expiryTime = new Date(submissionTime.getTime() + 3 * 60 * 60 * 1000); // 3 hours
        const timeRemaining = expiryTime - currentTime;
        
        // Only include if not expired and there's remaining volume
        if (timeRemaining > 0) {
          const volumeFromThisEntry = Math.min(remainingVolume, record.milk_volume);
          
          if (volumeFromThisEntry > 0) {
            activeAlerts.unshift({ // Add to beginning to maintain chronological order
              id: record.id,
              supplier_name: record.supplier_name || 'Unknown',
              milk_volume: volumeFromThisEntry,
              submissionTime,
              expiryTime,
              timeRemaining
            });
            
            remainingVolume -= volumeFromThisEntry;
          }
        }
      }
    }

    return activeAlerts;
  };

  const activeAlerts = getCurrentDirectProcessingVolume();

  // Calculate available capacity in tanks
  const calculateTankCapacity = (tankName) => {
    if (!milkReceptionData) return 0;
    
    const TANK_CAPACITIES = {
      'Tank A': 5000,
      'Tank B': 3000
    };

    const tankRecords = milkReceptionData
      .filter(record => record.tank_number === tankName)
      .reduce((total, record) => total + (record.milk_volume || 0), 0);

    const capacity = TANK_CAPACITIES[tankName] || 0;
    return Math.max(0, capacity - tankRecords);
  };

  // Don't render if no active alerts
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
                      <span className="font-medium">{alert.milk_volume.toFixed(1)}L</span>
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
