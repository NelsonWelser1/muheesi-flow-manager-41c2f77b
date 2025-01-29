import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Wrench } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

const MilkReceptionSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState({
    temperatureThreshold: 4.5,
    capacityWarningThreshold: 90,
    autoCleaningEnabled: false,
    cleaningInterval: 7,
    maintenanceInterval: 30
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (settingsData) => {
      console.log('Updating milk reception settings:', settingsData);
      const { data, error } = await supabase
        .from('milk_reception_settings')
        .upsert([settingsData]);

      if (error) {
        console.error('Error updating settings:', error);
        throw error;
      }
      
      console.log('Successfully updated settings:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milkReceptionSettings'] });
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    },
    onError: (error) => {
      console.error('Settings mutation error:', error);
      toast({
        title: "Error",
        description: "Failed to update settings: " + error.message,
        variant: "destructive"
      });
    }
  });

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    console.log('Settings submission started');
    
    try {
      await updateSettingsMutation.mutateAsync(settings);
      console.log('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Milk Reception Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSettingsSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="temperatureThreshold">Temperature Threshold (°C)</Label>
                <Input
                  id="temperatureThreshold"
                  type="number"
                  step="0.1"
                  value={settings.temperatureThreshold}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    temperatureThreshold: parseFloat(e.target.value)
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacityWarning">Capacity Warning Threshold (%)</Label>
                <Input
                  id="capacityWarning"
                  type="number"
                  value={settings.capacityWarningThreshold}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    capacityWarningThreshold: parseInt(e.target.value)
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cleaningInterval">Cleaning Interval (days)</Label>
                <Input
                  id="cleaningInterval"
                  type="number"
                  value={settings.cleaningInterval}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    cleaningInterval: parseInt(e.target.value)
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenanceInterval">Maintenance Interval (days)</Label>
                <Input
                  id="maintenanceInterval"
                  type="number"
                  value={settings.maintenanceInterval}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    maintenanceInterval: parseInt(e.target.value)
                  }))}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="autoCleaningEnabled"
                  checked={settings.autoCleaningEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    autoCleaningEnabled: checked
                  }))}
                />
                <Label htmlFor="autoCleaningEnabled">Enable Auto-Cleaning Alerts</Label>
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

      {/* Storage Tanks Status View */}
      <Card>
        <CardHeader>
          <CardTitle>View Storage Tanks Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((tank) => (
              <div key={tank} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Tank {tank}</h4>
                  <p className="text-sm text-gray-500">Last cleaned: 2 hours ago</p>
                </div>
                <div className="text-right">
                  <div className="font-bold">{Math.floor(Math.random() * 2000 + 1000)}L</div>
                  <div className="text-sm text-gray-500">Capacity: 5000L</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MilkReceptionSettings;