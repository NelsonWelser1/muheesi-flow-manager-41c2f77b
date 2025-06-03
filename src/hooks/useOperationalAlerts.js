
import { useState, useEffect, useCallback } from 'react';
import { useMilkReception } from '@/hooks/useMilkReception';

export const useOperationalAlerts = () => {
  const [operationalAlerts, setOperationalAlerts] = useState([]);
  const { data: milkReceptionData } = useMilkReception();

  // Check for operational issues and generate alerts
  const checkOperationalStatus = useCallback(() => {
    const alerts = [];

    if (milkReceptionData && milkReceptionData.length > 0) {
      // Check for direct processing milk that's been sitting too long
      const directProcessingRecords = milkReceptionData
        .filter(record => record.tank_number === 'Direct-Processing')
        .filter(record => record.milk_volume > 0);

      directProcessingRecords.forEach(record => {
        const submissionTime = new Date(record.created_at);
        const currentTime = new Date();
        const minutesSinceSubmission = (currentTime - submissionTime) / (1000 * 60);

        if (minutesSinceSubmission > 30) {
          alerts.push({
            id: `direct-processing-${record.id}`,
            title: 'Direct Processing Alert',
            message: `${record.milk_volume}L from ${record.supplier_name || 'Unknown'} has been in Direct Processing for ${Math.floor(minutesSinceSubmission)} minutes`,
            type: 'operational',
            timestamp: new Date().toISOString(),
            read: false,
            priority: 'high'
          });
        }
      });

      // Check tank capacity warnings
      const TANK_CAPACITIES = {
        'Tank A': 5000,
        'Tank B': 3000
      };

      Object.entries(TANK_CAPACITIES).forEach(([tankName, capacity]) => {
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
      });
    }

    // Add system status alerts
    const currentTime = new Date();
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
  }, [milkReceptionData]);

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
    alertCount: operationalAlerts.length
  };
};
