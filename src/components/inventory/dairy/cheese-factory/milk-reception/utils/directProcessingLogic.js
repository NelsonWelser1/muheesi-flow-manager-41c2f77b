
export const DIRECT_PROCESSING_TIME_LIMIT = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

export const checkDirectProcessingStatus = (records) => {
  const now = new Date();
  const directProcessingRecords = records.filter(record => 
    record.tank_number === 'Direct-Processing' && 
    record.milk_volume > 0 // Only positive volumes (incoming milk)
  );

  const pendingRecords = [];
  const expiredRecords = [];

  directProcessingRecords.forEach(record => {
    const recordTime = new Date(record.created_at);
    const timeElapsed = now - recordTime;
    const timeRemaining = DIRECT_PROCESSING_TIME_LIMIT - timeElapsed;

    // Check if there's a corresponding offload record
    const hasOffloadRecord = records.some(offloadRecord => 
      offloadRecord.tank_number === 'Direct-Processing' &&
      offloadRecord.milk_volume < 0 && // Negative volume indicates offload
      new Date(offloadRecord.created_at) > recordTime
    );

    if (!hasOffloadRecord) {
      if (timeRemaining > 0) {
        pendingRecords.push({
          ...record,
          timeRemaining,
          hoursRemaining: Math.floor(timeRemaining / (1000 * 60 * 60)),
          minutesRemaining: Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
        });
      } else {
        expiredRecords.push({
          ...record,
          timeOverdue: Math.abs(timeRemaining),
          hoursOverdue: Math.floor(Math.abs(timeRemaining) / (1000 * 60 * 60))
        });
      }
    }
  });

  return {
    pendingRecords,
    expiredRecords,
    hasPendingRecords: pendingRecords.length > 0,
    hasExpiredRecords: expiredRecords.length > 0
  };
};

export const getDirectProcessingAlerts = (status) => {
  const alerts = [];

  if (status.hasExpiredRecords) {
    alerts.push({
      type: 'error',
      title: 'Overdue Direct-Processing Milk',
      message: `${status.expiredRecords.length} batch(es) exceeded 6-hour limit and must be transferred to coolers immediately`,
      records: status.expiredRecords
    });
  }

  if (status.hasPendingRecords) {
    const urgentRecords = status.pendingRecords.filter(record => record.hoursRemaining < 1);
    if (urgentRecords.length > 0) {
      alerts.push({
        type: 'warning',
        title: 'Urgent Direct-Processing Action Required',
        message: `${urgentRecords.length} batch(es) must be processed or transferred within 1 hour`,
        records: urgentRecords
      });
    }
  }

  return alerts;
};
