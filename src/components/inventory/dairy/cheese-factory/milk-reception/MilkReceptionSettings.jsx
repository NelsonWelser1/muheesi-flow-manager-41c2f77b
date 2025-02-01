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
    temperature_threshold: 4.5,
    capacity_warning_threshold: 90,
    auto_cleaning_enabled: false,
    cleaning_interval: 7,
    maintenance_interval: 30
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (settingsData) => {
      console.log('Updating milk reception settings:', settingsData);
      
      // First check if we have an authenticated session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Authentication required');
      }

      const { data, error } = await supabase
        .from('milk_reception_settings')
        .upsert([settingsData])
        .select();

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