
import React from 'react';
import HealthRecordsView from '../../cattle/health/HealthRecordsView';

const DairyHealthRecordsView = ({ cattleData = [] }) => {
  return <HealthRecordsView cattleData={cattleData} />;
};

export default DairyHealthRecordsView;
