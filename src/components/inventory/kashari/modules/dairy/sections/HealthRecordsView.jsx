
import React from 'react';
import HealthRecordsView from '../../cattle/health/HealthRecordsView';

// This component is now only used for backward compatibility
// Health records have been moved exclusively to the cattle/health section
const DairyHealthRecordsView = () => {
  console.log("DairyHealthRecordsView is deprecated, use cattle/health/HealthRecordsView instead");
  return null;
};

export default DairyHealthRecordsView;
