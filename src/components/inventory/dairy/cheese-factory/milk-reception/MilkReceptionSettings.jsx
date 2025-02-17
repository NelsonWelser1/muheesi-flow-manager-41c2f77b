import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Wrench, Plus, AlertTriangle, Power, PowerOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';
import { useMilkReception } from '@/hooks/useMilkReception';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from 'date-fns';

const MilkReceptionSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: milkReceptionData } = useMilkReception();
  const [newTankName, setNewTankName] = useState('');
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedTank, setSelectedTank] = useState(null);
  const [outOfServiceDate, setOutOfServiceDate] = useState(null);
  const [outOfServiceTime, setOutOfServiceTime] = useState('');
  const [settings, setSettings] = useState({
    temperature_threshold: 4.5,
    capacity_warning_threshold: 90,
    auto_cleaning_enabled: false,
    cleaning_interval: 7,
    maintenance_interval: 30
  });

  const updateTankStatusMutation = useMutation({
    mutationFn: async ({ tankName, status, endDate = null }) => {
      console.log('Updating tank status:', { tankName, status, endDate });
      
      let finalDate = null;
      if (endDate && outOfServiceTime) {
        const [hours, minutes] = outOfServiceTime.split(':');
        finalDate = new Date(endDate);
        finalDate.setHours(parseInt(hours), parseInt(minutes));
      } else if (endDate) {
        finalDate = endDate;
      }

      const { data, error } = await supabase
        .from('storage_tanks')
        .update({
          status: status,
          service_end_date: finalDate?.toISOString()
        })
        .eq('tank_name', tankName)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milkReception'] });
      toast({
        title: "Success",
        description: "Tank status updated successfully",
      });
      setShowStatusDialog(false);
      setSelectedTank(null);
      setOutOfServiceDate(null);
      setOutOfServiceTime('');
    },
    onError: (error) => {
      console.error('Status update error:', error);
      toast({
        title: "Error",
        description: "Failed to update tank status: " + error.message,
        variant: "destructive"
      });
    }
  });

  const handleStatusChange = async (tank, status) => {
    if (status === 'out_of_service' && !outOfServiceDate) {
      toast({
        title: "Error",
        description: "Please select an end date for out of service period",
        variant: "destructive"
      });
      return;
    }

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
      {/* Tank Management Section */}
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

      {/* Status Change Dialog */}
      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Tank Status - {selectedTank}</AlertDialogTitle>
            <AlertDialogDescription>
              Select the new status for the tank
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex flex-col gap-4">
              <Button 
                variant="outline"
                onClick={() => handleStatusChange(selectedTank, 'active')}
                className="flex items-center gap-2"
              >
                <Power className="h-4 w-4 text-green-500" />
                Activate
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleStatusChange(selectedTank, 'suspended')}
                className="flex items-center gap-2"
              >
                <PowerOff className="h-4 w-4 text-yellow-500" />
                Suspend
              </Button>
              <div className="space-y-2">
                <Button 
                  variant="outline"
                  onClick={() => handleStatusChange(selectedTank, 'out_of_service')}
                  className="w-full flex items-center gap-2"
                >
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Out of Service
                </Button>
                <div className="pt-2 space-y-4">
                  <div>
                    <Label>Service End Date</Label>
                    <DatePicker
                      date={outOfServiceDate}
                      setDate={setOutOfServiceDate}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label>Service End Time</Label>
                    <Input
                      type="time"
                      value={outOfServiceTime}
                      onChange={(e) => setOutOfServiceTime(e.target.value)}
                      className="w-full mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Reception Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSettingsSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="temperature_threshold">Temperature Threshold (°C)</Label>
                <Input
                  id="temperature_threshold"
                  type="number"
                  step="0.1"
                  value={settings.temperature_threshold}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    temperature_threshold: parseFloat(e.target.value)
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity_warning">Capacity Warning Threshold (%)</Label>
                <Input
                  id="capacity_warning"
                  type="number"
                  value={settings.capacity_warning_threshold}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    capacity_warning_threshold: parseInt(e.target.value)
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cleaning_interval">Cleaning Interval (days)</Label>
                <Input
                  id="cleaning_interval"
                  type="number"
                  value={settings.cleaning_interval}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    cleaning_interval: parseInt(e.target.value)
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenance_interval">Maintenance Interval (days)</Label>
                <Input
                  id="maintenance_interval"
                  type="number"
                  value={settings.maintenance_interval}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    maintenance_interval: parseInt(e.target.value)
                  }))}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="auto_cleaning_enabled"
                  checked={settings.auto_cleaning_enabled}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    auto_cleaning_enabled: checked
                  }))}
                />
                <Label htmlFor="auto_cleaning_enabled">Enable Auto-Cleaning Alerts</Label>
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit"
                className="flex items-center gap-2"
                disabled={updateSettingsMutation.isPending}
              >
                <Wrench className="h-4 w-4" />
                {updateSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MilkReceptionSettings;
