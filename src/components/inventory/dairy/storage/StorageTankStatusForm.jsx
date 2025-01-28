import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Thermometer, Clock, User, AlertCircle, Settings, Wrench } from "lucide-react";
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

const StorageTankStatusForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedTank, setSelectedTank] = useState('Tank A');
  const [cleaningRecord, setCleaningRecord] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
    cleanerId: ''
  });
  const [volumeData, setVolumeData] = useState({
    initialVolume: '',
    addedVolume: '',
    temperature: ''
  });
  const [settings, setSettings] = useState({
    temperatureThreshold: 4.5,
    capacityWarningThreshold: 90,
    autoCleaningEnabled: false,
    cleaningInterval: 7,
    maintenanceInterval: 30
  });

  // Fetch tanks data with error handling
  const { data: tanks, isLoading: isLoadingTanks, error: tanksError } = useQuery({
    queryKey: ['storageTanks'],
    queryFn: async () => {
      console.log('Fetching storage tanks data');
      const { data, error } = await supabase
        .from('storage_tanks')
        .select('*');
      
      if (error) {
        console.error('Error fetching storage tanks:', error);
        throw error;
      }
      
      return data || [];
    }
  });

  // Add mutation for cleaning records
  const addCleaningRecordMutation = useMutation({
    mutationFn: async (cleaningData) => {
      console.log('Adding cleaning record:', cleaningData);
      const { data, error } = await supabase
        .from('tank_cleaning_records')
        .insert([cleaningData])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storageTanks'] });
      toast({
        title: "Success",
        description: "Cleaning record added successfully",
      });
    },
    onError: (error) => {
      console.error('Error adding cleaning record:', error);
      toast({
        title: "Error",
        description: "Failed to add cleaning record. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Add mutation for volume records
  const addVolumeRecordMutation = useMutation({
    mutationFn: async (volumeData) => {
      console.log('Adding volume record:', volumeData);
      const { data, error } = await supabase
        .from('tank_volume_records')
        .insert([volumeData])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storageTanks'] });
      toast({
        title: "Success",
        description: "Volume record added successfully",
      });
    },
    onError: (error) => {
      console.error('Error adding volume record:', error);
      toast({
        title: "Error",
        description: "Failed to add volume record. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Add mutation for settings
  const updateSettingsMutation = useMutation({
    mutationFn: async (settingsData) => {
      console.log('Updating settings:', settingsData);
      const { data, error } = await supabase
        .from('storage_tank_settings')
        .upsert([settingsData])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tankSettings'] });
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedTank) {
      newErrors.selectedTank = 'Tank selection is required';
    }
    if (!volumeData.initialVolume) {
      newErrors.initialVolume = 'Initial volume is required';
    }
    if (!volumeData.temperature) {
      newErrors.temperature = 'Temperature is required';
    }
    if (!cleaningRecord.cleanerId) {
      newErrors.cleanerId = 'Cleaner ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate current volume
  const calculateCurrentVolume = () => {
    const initial = parseFloat(volumeData.initialVolume) || 0;
    const added = parseFloat(volumeData.addedVolume) || 0;
    return initial + added;
  };

  // Submit form with error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Form submission started');
    
    try {
      if (!validateForm()) {
        console.log('Form validation failed');
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const currentVolume = calculateCurrentVolume();
      const selectedTankData = tanks?.find(tank => tank.name === selectedTank);
      
      if (!selectedTankData) {
        throw new Error('Selected tank not found');
      }

      console.log('Submitting cleaning record...');
      // Submit cleaning record
      await addCleaningRecordMutation.mutateAsync({
        tank_id: selectedTankData.id,
        cleaning_date: cleaningRecord.date,
        cleaning_time: cleaningRecord.time,
        cleaner_id: cleaningRecord.cleanerId
      });

      console.log('Submitting volume record...');
      // Submit volume record
      await addVolumeRecordMutation.mutateAsync({
        tank_id: selectedTankData.id,
        initial_volume: parseFloat(volumeData.initialVolume),
        added_volume: parseFloat(volumeData.addedVolume) || 0,
        temperature: parseFloat(volumeData.temperature),
        total_volume: currentVolume
      });

      console.log('Form submission completed successfully');
      toast({
        title: "Success",
        description: "Tank status updated successfully",
      });

      // Reset form
      setVolumeData({
        initialVolume: '',
        addedVolume: '',
        temperature: ''
      });
      setCleaningRecord({
        date: format(new Date(), 'yyyy-MM-dd'),
        time: format(new Date(), 'HH:mm'),
        cleanerId: ''
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update tank status",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    console.log('Settings submission started');
    try {
      await updateSettingsMutation.mutateAsync({
        ...settings,
        tank_id: tanks?.find(tank => tank.name === selectedTank)?.id
      });
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

  if (isLoadingTanks) {
    return <div>Loading tanks data...</div>;
  }

  if (tanksError) {
    return <div>Error loading tanks: {tanksError.message}</div>;
  }

  // ... keep existing code (JSX for the form UI)

  return (
    <div className="space-y-6">
      <Tabs defaultValue="status">
        <TabsList>
          <TabsTrigger value="status">Tank Status</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Storage Tank Status Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tankSelection" className={errors.selectedTank ? 'text-red-500' : ''}>
                      Select Tank {errors.selectedTank && <span className="text-red-500">*</span>}
                    </Label>
                    <Select
                      value={selectedTank}
                      onValueChange={setSelectedTank}
                    >
                      <SelectTrigger className={errors.selectedTank ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select a tank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tank A">Tank A</SelectItem>
                        <SelectItem value="Tank B">Tank B</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.selectedTank && <p className="text-sm text-red-500">{errors.selectedTank}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cleanerId" className={errors.cleanerId ? 'text-red-500' : ''}>
                      Cleaner ID {errors.cleanerId && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      id="cleanerId"
                      value={cleaningRecord.cleanerId}
                      onChange={(e) => setCleaningRecord(prev => ({
                        ...prev,
                        cleanerId: e.target.value
                      }))}
                      placeholder="Enter cleaner ID"
                      className={errors.cleanerId ? 'border-red-500' : ''}
                    />
                    {errors.cleanerId && <p className="text-sm text-red-500">{errors.cleanerId}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="initialVolume" className={errors.initialVolume ? 'text-red-500' : ''}>
                      Initial Volume (L) {errors.initialVolume && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      id="initialVolume"
                      type="number"
                      value={volumeData.initialVolume}
                      onChange={(e) => setVolumeData(prev => ({
                        ...prev,
                        initialVolume: e.target.value
                      }))}
                      placeholder="Enter initial volume"
                      className={errors.initialVolume ? 'border-red-500' : ''}
                    />
                    {errors.initialVolume && <p className="text-sm text-red-500">{errors.initialVolume}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addedVolume">Added Volume (L)</Label>
                    <Input
                      id="addedVolume"
                      type="number"
                      value={volumeData.addedVolume}
                      onChange={(e) => setVolumeData(prev => ({
                        ...prev,
                        addedVolume: e.target.value
                      }))}
                      placeholder="Enter added volume"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="temperature" className={errors.temperature ? 'text-red-500' : ''}>
                      Temperature (°C) {errors.temperature && <span className="text-red-500">*</span>}
                    </Label>
                    <div className="relative">
                      <Input
                        id="temperature"
                        type="number"
                        step="0.1"
                        value={volumeData.temperature}
                        onChange={(e) => setVolumeData(prev => ({
                          ...prev,
                          temperature: e.target.value
                        }))}
                        placeholder="Enter temperature"
                        className={`pl-9 ${errors.temperature ? 'border-red-500' : ''}`}
                      />
                      <Thermometer className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    </div>
                    {errors.temperature && <p className="text-sm text-red-500">{errors.temperature}</p>}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-500">Current Volume: </span>
                    <span className="font-bold">{calculateCurrentVolume()} L</span>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {isSubmitting ? 'Updating...' : 'Update Tank Status'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Tank Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSettingsSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Storage Tanks Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tanks?.map((tank) => (
              <div key={tank.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="space-y-1">
                  <h4 className="font-semibold flex items-center gap-2">
                    {tank.name}
                    {parseFloat(tank.temperature) > 6 && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Last cleaned: {format(new Date(tank.last_cleaned || new Date()), 'PPp')}
                  </p>
                  <p className="text-sm text-gray-500">
                    Cleaner ID: {tank.cleaner_id || 'N/A'}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <div className="font-bold">{tank.current_volume}L</div>
                  <div className="text-sm text-gray-500">Temperature: {tank.temperature}°C</div>
                  <div className="text-sm text-gray-500">Capacity: {tank.capacity || 5000}L</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageTankStatusForm;
