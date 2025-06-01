
import { useMemo } from 'react';

export const useMaintenanceStats = (maintenanceData) => {
  return useMemo(() => {
    if (!maintenanceData) return { due: 0, upcoming: 0, completed: 0 };
    return {
      due: maintenanceData.filter(task => task.status === 'maintenance').length,
      upcoming: maintenanceData.filter(task => task.status === 'operational').length,
      completed: maintenanceData.filter(task => task.status === 'completed').length
    };
  }, [maintenanceData]);
};
