
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Wrench } from "lucide-react";
import { useMilkReception } from '@/hooks/useMilkReception';
import { useMilkReceptionSettings } from '@/hooks/useMilkReceptionSettings';
import { useTankStatus } from '@/hooks/useTankStatus';
import { TankStatusDialog } from './TankStatusDialog';
import { SettingsForm } from './SettingsForm';

const MilkReceptionSettings = () => {
  const { data: milkReceptionData } = useMilkReception();
  const { settings, setSettings, updateSettingsMutation } = useMilkReceptionSettings();
  const {
    showStatusDialog,
    setShowStatusDialog,
    selectedTank,
    setSelectedTank,
    outOfServiceDate,
    setOutOfServiceDate,
    outOfServiceTime,
    setOutOfServiceTime,
    updateTankStatusMutation
  } = useTankStatus();

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSettingsMutation.mutateAsync(settings);
    } catch (error) {
      console.error('Error submitting settings:', error);
    }
  };

  const handleStatusChange = async (tank, status) => {
    try {
      await updateTankStatusMutation.mutateAsync({
        tankName: tank,
        status: status,
        endDate: outOfServiceDate
      });
    } catch (error) {
      console.error('Error updating tank status:', error);
    }
  };

  const calculateTankVolumes = () => {
    if (!milkReceptionData) return { tankA: 0, tankB: 0, directProcessing: 0 };
    
    return milkReceptionData.reduce((acc, record) => {
      if (record.tank_number === 'Tank A') {
        acc.tankA += record.milk_volume;
      } else if (record.tank_number === 'Tank B') {
        acc.tankB += record.milk_volume;
      } else if (record.tank_number === 'Direct-Processing') {
        acc.directProcessing += record.milk_volume;
      }
      return acc;
    }, { tankA: 0, tankB: 0, directProcessing: 0 });
  };

  const tankVolumes = calculateTankVolumes();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Storage Tanks Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Tank A', 'Tank B', 'Direct-Processing'].map((tank) => (
              <div key={tank} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">{tank}</h4>
                  <p className="text-sm text-gray-500">
                    {tank === 'Direct-Processing' 
                      ? 'Bypass storage tanks for immediate processing'
                      : `Capacity: 5000L`}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold">
                      Status: {tank.status || 'Active'}
                    </div>
                    {tank !== 'Direct-Processing' && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedTank(tank);
                          setShowStatusDialog(true);
                        }}
                      >
                        Change Status
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <TankStatusDialog
        showDialog={showStatusDialog}
        setShowDialog={setShowStatusDialog}
        selectedTank={selectedTank}
        outOfServiceDate={outOfServiceDate}
        setOutOfServiceDate={setOutOfServiceDate}
        outOfServiceTime={outOfServiceTime}
        setOutOfServiceTime={setOutOfServiceTime}
        onStatusChange={handleStatusChange}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Reception Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsForm
            settings={settings}
            setSettings={setSettings}
            onSubmit={handleSettingsSubmit}
            isSubmitting={updateSettingsMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MilkReceptionSettings;
