
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DistributionFormContent from './DistributionFormContent';
import DistributionRecordsTable from './DistributionRecordsTable';
import { useDistributionRecords } from './hooks/useDistributionRecords';

const SalesDistributionForm = ({ onBack }) => {
  const { distributionRecords, isLoading } = useDistributionRecords();

  return (
    <div className="space-y-6">
      {onBack && (
        <button 
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Sales Distribution Form</CardTitle>
        </CardHeader>
        <CardContent>
          <DistributionFormContent />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Distribution Records</CardTitle>
        </CardHeader>
        <CardContent>
          <DistributionRecordsTable 
            records={distributionRecords} 
            isLoading={isLoading} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesDistributionForm;
