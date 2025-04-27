
import React from 'react';
import { HealthRecordsView } from '../../../kashari/modules/cattle/health';

// This wrapper component allows reuse of the Kashari health records system
const DairyHealthRecordsView = ({ cattleId = null }) => {
  return <HealthRecordsView cattleId={cattleId} />;
};

export default DairyHealthRecordsView;
