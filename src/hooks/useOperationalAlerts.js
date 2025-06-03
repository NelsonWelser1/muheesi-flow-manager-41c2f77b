
import { useState, useEffect, useCallback } from 'react';
import { useMilkReception } from '@/hooks/useMilkReception';

export const useOperationalAlerts = () => {
  const [operationalAlerts, setOperationalAlerts] = useState([]);
  const { data: milkReceptionData } = useMilkReception();

  // Calculate current milk volume in Direct Processing
  const getCurrentDirectProcessingVolume = useCallback(() => {
    if (!milkReceptionData || milkReceptionData.length === 0) {
      return { totalVolume: 0, entries: [] };
    }

    // Get all Direct Processing records sorted by time
    const directProcessingRecords = milkReceptionData
      .filter(record => record.tank_number === 'Direct-Processing')
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    if (directProcessingRecords.length === 0) {
      return { totalVolume: 0, entries: [] };
    }

    // Calculate net volume (positive additions minus negative utilizations)
    const totalNetVolume = directProcessingRecords.reduce((total, record) => {
      return total + (record.milk_volume || 0);
    }, 0);

    // If no milk remaining, return empty
    if (totalNetVolume <= 0) {
      return { totalVolume: 0, entries: [] };
    }

    // Find which specific entries still have milk remaining
    const positiveRecords = directProcessingRecords.filter(r => r.milk_volume > 0);
    let remainingVolume = totalNetVolume;
    const currentEntries = [];

    // Process in reverse chronological order to find current milk
    const sortedPositiveRecords = [...positiveRecords].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    for (const record of sortedPositiveRecords) {
      if (remainingVolume > 0) {
        const volumeFromThisEntry = Math.min(remainingVolume, record.milk_volume);
        
        if (volumeFromThisEntry > 0) {
          currentEntries.unshift({
            id: record.id,
            supplier_name: record.supplier_name || 'Unknown',
            milk_volume: volumeFromThisEntry,
            submissionTime: new Date(record.created_at),
            originalVolume: record.milk_volume
          });
          
          remainingVolume -= volumeFromThisEntry;
        }
      }
    }

    return {
      totalVolume: totalNetVolume,
      entries: currentEntries
    };
  }, [milkReceptionData]);

  // Check for operational issues and generate alerts
  const checkOperationalStatus = useCallback(() => {
    const alerts = [];
    const currentTime = new Date();

    // Get current Direct Processing volume
    const { totalVolume, entries } = getCurrentDirectProcessingVolume();

    if (totalVolume > 0 && entries.length > 0) {
      // Create alert for current milk in Direct Processing
      const alertEntries = entries.map(entry => {
        const minutesSinceSubmission = (currentTime - entry.submissionTime) / (1000 * 60);
        return `${entry.milk_volume.toFixed(1)}L from ${entry.supplier_name} (${Math.floor(minutesSinceSubmission)} min ago)`;
      });

      const alertMessage = entries.length === 1 
        ? alertEntries[0]
        : `Total ${totalVolume.toFixed(1)}L: ${alertEntries.join(', ')}`;

      // Check if any milk has been there for more than 30 minutes
      const hasUrgentMilk = entries.some(entry => {
        const minutesSinceSubmission = (currentTime - entry.submissionTime) / (1000 * 60);
        return minutesSinceSubmission > 30;
      });

      if (hasUrgentMilk) {
        alerts.push({
          id: 'direct-processing-current',
          title: 'Direct Processing Alert',
          message: `Current milk needs immediate transfer: ${alertMessage}`,
          type: 'operational',
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'high'
        });
      }
    }

    // Check tank capacity warnings
    const TANK_CAPACITIES = {
      'Tank A': 5000,
      'Tank B': 3000
    };

    Object.entries(TANK_CAPACITIES).forEach(([tankName, capacity]) => {
      if (milkReceptionData) {
        const tankRecords = milkReceptionData.filter(record => record.tank_number === tankName);
        const currentVolume = tankRecords.reduce((total, record) => total + (record.milk_volume || 0), 0);
        const utilizationPercentage = (currentVolume / capacity) * 100;

        if (utilizationPercentage > 90) {
          alerts.push({
            id: `tank-capacity-${tankName}`,
            title: 'Tank Capacity Warning',
            message: `${tankName} is ${utilizationPercentage.toFixed(1)}% full (${currentVolume.toFixed(1)}L/${capacity}L)`,
            type: 'warning',
            timestamp: new Date().toISOString(),
            read: false,
            priority: 'medium'
          });
        }
      }
    });

    // Add system status alerts
    const currentHour = currentTime.getHours();
    
    // Operating hours check (6 AM to 10 PM)
    if (currentHour < 6 || currentHour > 22) {
      alerts.push({
        id: 'operating-hours',
        title: 'Off-Hours Operation',
        message: 'System is operating outside normal hours (6 AM - 10 PM)',
        type: 'info',
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'low'
      });
    }

    setOperationalAlerts(alerts);
  }, [milkReceptionData, getCurrentDirectProcessingVolume]);

  // Check operational status periodically
  useEffect(() => {
    checkOperationalStatus();
    
    const interval = setInterval(checkOperationalStatus, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [checkOperationalStatus]);

  // Manual refresh function
  const refreshAlerts = useCallback(() => {
    checkOperationalStatus();
  }, [checkOperationalStatus]);

  return {
    operationalAlerts,
    refreshAlerts,
    alertCount: operationalAlerts.length,
    getCurrentDirectProcessingVolume
  };
};
