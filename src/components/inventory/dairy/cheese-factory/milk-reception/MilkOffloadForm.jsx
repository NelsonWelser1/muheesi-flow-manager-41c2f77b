
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ValidationError } from './components/ValidationError';
import { RecentOffloadRecords } from './components/RecentOffloadRecords';
import { MilkOffloadFormContent } from './components/MilkOffloadFormContent';
import { useMilkOffloadForm } from './hooks/useMilkOffloadForm';
import { useMilkReception } from '@/hooks/useMilkReception';
import MilkBalanceTracker from './MilkBalanceTracker';

const MilkOffloadForm = () => {
  const {
    formData,
    loading,
    validationError,
    cooldownActive,
    cooldownTimeLeft,
    handleTankSelection,
    handleInputChange,
    handleSubmit,
    milkReceptionData
  } = useMilkOffloadForm();

  const { refetch } = useMilkReception();

  return (
    <div className="space-y-6">
      {/* Tank Volumes Display */}
      <MilkBalanceTracker />
      
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
            cooldownActive={cooldownActive}
            cooldownTimeLeft={cooldownTimeLeft}
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
          <RecentOffloadRecords 
            records={milkReceptionData} 
            onRefresh={refetch}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MilkOffloadForm;
