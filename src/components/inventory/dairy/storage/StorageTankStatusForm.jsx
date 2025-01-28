import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Thermometer, Droplet, Clock, User, AlertCircle, Settings, Wrench } from "lucide-react";
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

// Pre-fetch function for tanks data
const fetchTanks = async () => {
  console.log('Fetching storage tanks data');
  const { data, error } = await supabase
    .from('storage_tanks')
    .select('*');
  
  if (error) {
    console.error('Error fetching tanks:', error);
    throw error;
  }

  // If no tanks exist, create Tank A and Tank B
  if (!data || data.length === 0) {
    const defaultTanks = [
      { name: 'Tank A', capacity: 5000, current_volume: 0, temperature: 4 },
      { name: 'Tank B', capacity: 5000, current_volume: 0, temperature: 4 }
    ];

    const { error: insertError } = await supabase
      .from('storage_tanks')
      .insert(defaultTanks);

    if (insertError) {
      console.error('Error creating default tanks:', insertError);
      throw insertError;
    }

    // Fetch the newly created tanks to get their UUIDs
    const { data: newTanks, error: fetchError } = await supabase
      .from('storage_tanks')
      .select('*')
      .in('name', ['Tank A', 'Tank B']);

    if (fetchError) {
      console.error('Error fetching new tanks:', fetchError);
      throw fetchError;
    }

    return newTanks;
  }

  return data;
};

const StorageTankStatusForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTank, setSelectedTank] = useState('');
  const [errors, setErrors] = useState({});
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

  // New settings states
  const [settings, setSettings] = useState({
    temperatureThreshold: 4.5,
    capacityWarningThreshold: 90,
    autoCleaningEnabled: false,
    cleaningInterval: 7, // days
    maintenanceInterval: 30, // days
    lastMaintenance: format(new Date(), 'yyyy-MM-dd'),
    nextMaintenance: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
  });

  // Pre-fetch tanks data
  React.useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['storageTanks'],
      queryFn: fetchTanks,
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    });
  }, [queryClient]);

  // Use the pre-fetched data
  const { data: tanks, isLoading } = useQuery({
    queryKey: ['storageTanks'],
    queryFn: fetchTanks,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    initialData: () => {
      const cachedData = queryClient.getQueryData(['storageTanks']);
      if (cachedData) {
        console.log('Using cached tanks data');
        return cachedData;
      }
      return undefined;
    },
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings) => {
      console.log('Updating tank settings:', newSettings);
      const { error } = await supabase
        .from('storage_tanks')
        .update({
          temperature_threshold: newSettings.temperatureThreshold,
          capacity_warning_threshold: newSettings.capacityWarningThreshold,
          auto_cleaning_enabled: newSettings.autoCleaningEnabled,
          cleaning_interval: newSettings.cleaningInterval,
          maintenance_interval: newSettings.maintenanceInterval,
          last_maintenance: newSettings.lastMaintenance,
          next_maintenance: newSettings.nextMaintenance
        })
        .eq('id', selectedTank);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['storageTanks']);
      toast({
        title: "Success",
        description: "Tank settings updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to update tank settings",
        variant: "destructive",
      });
    }
  });

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedTank) {
      newErrors.tank = 'Please select a tank';
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

  // Submit tank status update
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Handle the submission logic here
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
              <CardTitle className="flex items-center gap-2">
                <Droplet className="h-5 w-5" />
                Storage Tank Status Entry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tank" className={errors.tank ? 'text-red-500' : ''}>
                      Select Tank {errors.tank && <span className="text-red-500">*</span>}
                    </Label>
                    <Select 
                      value={selectedTank}
                      onValueChange={setSelectedTank}
                    >
                      <SelectTrigger className={errors.tank ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select a tank" />
                      </SelectTrigger>
                      <SelectContent>
                        {tanks?.map((tank) => (
                          <SelectItem key={tank.id} value={tank.id}>
                            {tank.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.tank && <p className="text-sm text-red-500">{errors.tank}</p>}
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
                    className="flex items-center gap-2"
                  >
                    Update Tank Status
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
              <form onSubmit={(e) => {
                e.preventDefault();
                updateSettingsMutation.mutate(settings);
              }} className="space-y-6">
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
                  >
                    <Wrench className="h-4 w-4" />
                    Save Settings
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
