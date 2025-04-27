
import { useState, useEffect } from 'react';

export function usePersonnelMetrics() {
  const [metrics, setMetrics] = useState({
    employeeCount: 24,
    avgPerformance: 4.2,
    activeRecruitments: 3,
    onShiftCount: 15,
    hoursWorked: 164,
    pendingReviews: 5,
    currentShift: {
      morningShift: ['John D.', 'Mary S.', 'Robert L.', 'Emily P.', 'Daniel K.'],
      afternoonShift: ['Sarah M.', 'Michael T.', 'Jessica R.', 'David C.'],
      nightShift: ['Thomas G.', 'Lisa W.', 'Kevin H.']
    }
  });

  // Simulating data fetch with useEffect
  useEffect(() => {
    // This would typically be a real API call
    const fetchMetricsData = async () => {
      // For demo purposes, we'll just use the initial state
    };

    fetchMetricsData();
  }, []);

  return metrics;
}
