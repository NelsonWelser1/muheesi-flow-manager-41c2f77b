
import React from 'react';
import { Card } from "@/components/ui/card";
import HealthRecordsView from '../cattle/health/HealthRecordsView';

const HealthRecordsForm = () => {
  return (
    <Card className="p-6">
      <HealthRecordsView />
    </Card>
  );
};

export default HealthRecordsForm;
