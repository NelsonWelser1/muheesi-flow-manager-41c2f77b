
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ValidationError } from './components/ValidationError';
import { RecentOffloadRecords } from './components/RecentOffloadRecords';
import { MilkOffloadFormContent } from './components/MilkOffloadFormContent';
import { useMilkOffloadForm } from './hooks/useMilkOffloadForm';

const MilkOffloadForm = () => {
  const {
    formData,
    loading,
    validationError,
    handleTankSelection,
    handleInputChange,
    handleSubmit,
    milkReceptionData
  } = useMilkOffloadForm();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>New Tank Offload Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <ValidationError 
            error={validationError} 
            onSwitchTank={handleTankSelection} 
          />

          <MilkOffloadFormContent 
            formData={formData}
            loading={loading}
            handleTankSelection={handleTankSelection}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            onQualityChange={(value) => handleInputChange({ 
              target: { name: 'quality_check', value } 
            })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Offload Records</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentOffloadRecords records={milkReceptionData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default MilkOffloadForm;
