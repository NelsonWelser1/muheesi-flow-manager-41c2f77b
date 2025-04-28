
import React from 'react';
import HealthRecordsView from '../../cattle/health/HealthRecordsView';

const DairyHealthRecordsView = ({ cattleData = [] }) => {
  console.log("DairyHealthRecordsView rendering with cattle data:", cattleData);
  return <HealthRecordsView cattleData={cattleData} />;
};

export default DairyHealthRecordsView;
