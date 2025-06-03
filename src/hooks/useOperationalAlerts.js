
import { useEffect } from 'react';
import { useNotifications } from './useNotifications';
import { useMilkReception } from './useMilkReception';

export const useOperationalAlerts = () => {
  const { addNotification } = useNotifications();
  const { data: milkReceptionData } = useMilkReception();

  // Monitor tank capacity levels
  useEffect(() => {
    if (!milkReceptionData) return;

    const TANK_CAPACITIES = {
      'Tank A': 5000,
      'Tank B': 3000
    };

    Object.entries(TANK_CAPACITIES).forEach(([tankName, capacity]) => {
      const currentVolume = milkReceptionData
        .filter(record => record.tank_number === tankName)
        .reduce((total, record) => total + (record.milk_volume || 0), 0);

      const utilizationPercentage = (currentVolume / capacity) * 100;

      if (utilizationPercentage >= 95) {
        addNotification({
          title: `${tankName} Critical Capacity`,
          message: `${tankName} is at ${utilizationPercentage.toFixed(1)}% capacity (${currentVolume.toFixed(1)}L/${capacity}L). Immediate action required!`,
          type: 'alert',
          priority: 'critical',
          section: 'Milk Reception'
        });
      } else if (utilizationPercentage >= 85) {
        addNotification({
          title: `${tankName} High Capacity`,
          message: `${tankName} is at ${utilizationPercentage.toFixed(1)}% capacity (${currentVolume.toFixed(1)}L/${capacity}L). Consider processing or transferring milk.`,
          type: 'warning',
          priority: 'high',
          section: 'Milk Reception'
        });
      }
    });
  }, [milkReceptionData, addNotification]);

  // Monitor direct processing alerts
  useEffect(() => {
    if (!milkReceptionData) return;

    const directProcessingRecords = milkReceptionData
      .filter(record => record.tank_number === 'Direct-Processing');

    const totalNetVolume = directProcessingRecords.reduce((total, record) => {
      return total + (record.milk_volume || 0);
    }, 0);

    if (totalNetVolume > 0) {
      const positiveRecords = directProcessingRecords.filter(r => r.milk_volume > 0);
      const currentTime = new Date();

      positiveRecords.forEach(record => {
        const submissionTime = new Date(record.created_at);
        const timeDiff = currentTime - submissionTime;
        const minutesPassed = Math.floor(timeDiff / (1000 * 60));

        if (minutesPassed >= 25 && minutesPassed < 30) {
          addNotification({
            title: 'Direct Processing Warning',
            message: `Milk from ${record.supplier_name || 'Unknown'} (${record.milk_volume.toFixed(1)}L) will require processing in ${30 - minutesPassed} minutes.`,
            type: 'warning',
            priority: 'medium',
            section: 'Direct Processing'
          });
        }
      });
    }
  }, [milkReceptionData, addNotification]);

  // Monitor temperature alerts
  useEffect(() => {
    if (!milkReceptionData) return;

    const recentRecords = milkReceptionData
      .filter(record => {
        const recordTime = new Date(record.created_at);
        const timeDiff = new Date() - recordTime;
        return timeDiff < 30 * 60 * 1000; // Last 30 minutes
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    recentRecords.forEach(record => {
      if (record.temperature > 6) {
        addNotification({
          title: 'Temperature Alert',
          message: `High temperature detected: ${record.temperature}°C in ${record.tank_number}. Optimal temperature is ≤6°C.`,
          type: 'warning',
          priority: 'high',
          section: 'Quality Control'
        });
      } else if (record.temperature < 2) {
        addNotification({
          title: 'Temperature Warning',
          message: `Low temperature detected: ${record.temperature}°C in ${record.tank_number}. Risk of freezing.`,
          type: 'warning',
          priority: 'medium',
          section: 'Quality Control'
        });
      }
    });
  }, [milkReceptionData, addNotification]);

  return {
    // This hook manages operational alerts automatically
  };
};
